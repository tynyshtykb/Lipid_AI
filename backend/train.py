import os
from datetime import datetime
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import pearsonr, kstest
from sklearn.base import clone
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import (
    r2_score,
    mean_squared_error,
    mean_absolute_error,
    PredictionErrorDisplay,
)
from sklearn.inspection import permutation_importance
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor


INTERNAL_FILE = "datasetLDL.xlsx"
EXTERNAL_FILE = "outputdataset.xlsx"
OUTPUT_DIR = "ldl_outputs"
RANDOM_STATE = 42
TEST_SIZE = 0.2

os.makedirs(OUTPUT_DIR, exist_ok=True)
def standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename_map = {
        "HDL": "HDL-C",
        "HDL_C": "HDL-C",
        "HDLC": "HDL-C",
        "AGE": "Age",
        "age": "Age",
        "LDL": "LDL-C",
        "LDL_C": "LDL-C",
        "LDLC": "LDL-C",
        "gender": "Gender",
        "SEX": "Gender",
        "sex": "Gender",
    }
    df = df.rename(columns=rename_map)
    return df
def load_dataset(file_path: str, required_cols: list[str]) -> pd.DataFrame:
    df = pd.read_excel(file_path, header=0)
    df = standardize_columns(df)
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(
            f"Missing required columns in {file_path}: {missing}\n"
            f"Available columns: {list(df.columns)}"
        )
    df = df[required_cols].apply(pd.to_numeric, errors="coerce")
    df = df.dropna().reset_index(drop=True)
    return df
def print_basic_statistics(df: pd.DataFrame, gender_col: str = "Gender") -> None:
    print("\n========== BASIC STATISTICS ==========")
    print(df.describe().loc[["25%", "50%", "75%"]])
    if gender_col in df.columns:
        gender_stats = df[gender_col].value_counts(normalize=True) * 100
        male_percent = gender_stats.get(1, 0.0)
        male_count = (df[gender_col] == 1).sum()
        print(f"\nTotal rows: {len(df)}")
        print(f"Male count (Gender==1): {male_count}")
        print(f"Male percent: {male_percent:.2f}%")
    print("======================================\n")
def remove_duplicates(df: pd.DataFrame, subset_cols: list[str]) -> pd.DataFrame:
    return df.drop_duplicates(subset=subset_cols, keep="first").reset_index(drop=True)
def ks_normality_test(series: pd.Series, name: str) -> None:
    x = series.dropna()
    if len(x) < 3:
        print(f"K-S test skipped for {name}: too few samples")
        return
    x_std = (x - x.mean()) / x.std(ddof=1)
    stat, p_value = kstest(x_std, "norm")
    print(f"K-S test for {name}")
    print(f"Statistic: {stat:.6f}")
    print(f"p-value  : {p_value:.6f}")
    if p_value > 0.05:
        print("Result   : cannot reject normality")
    else:
        print("Result   : reject normality")
    print()
def build_model_configs():
    numeric_features = ["TC", "TG", "HDL-C", "Age"]
    scaled_preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]), numeric_features)
        ],
        remainder="drop"
    )
    unscaled_preprocessor = ColumnTransformer(
        transformers=[
            ("num", Pipeline([
                ("imputer", SimpleImputer(strategy="median"))
            ]), numeric_features)
        ],
        remainder="drop"
    )

    configs = {
        "RandomForest": {
            "pipeline": Pipeline([
                ("prep", unscaled_preprocessor),
                ("model", RandomForestRegressor(random_state=RANDOM_STATE))
            ]),
            "params": {
                "model__n_estimators": [50, 100, 150],
                "model__max_depth": [None, 10, 20, 30],
                "model__min_samples_split": [2, 5, 10],
                "model__min_samples_leaf": [1, 2, 4],
                "model__max_features": [None, "sqrt", "log2", 1.0],
            }
        },
        "GradientBoosting": {
            "pipeline": Pipeline([
                ("prep", unscaled_preprocessor),
                ("model", GradientBoostingRegressor(random_state=RANDOM_STATE))
            ]),
            "params": {
                "model__n_estimators": [50, 100, 150],
                "model__learning_rate": [0.01, 0.1, 0.3],
                "model__max_depth": [3, 5, 7],
                "model__subsample": [0.5, 0.7, 1.0],
                "model__max_features": ["sqrt", "log2", None],
            }
        }
    }

    return configs
def safe_pearson(y_true, y_pred):
    if len(y_true) < 2:
        return np.nan, np.nan
    if pd.Series(y_true).nunique() < 2 or pd.Series(y_pred).nunique() < 2:
        return np.nan, np.nan
    return pearsonr(y_true, y_pred)
def evaluate_predictions(y_true, y_pred) -> dict:
    pearson_corr, p_value = safe_pearson(y_true, y_pred)
    return {
        "R2": r2_score(y_true, y_pred),
        "MAE": mean_absolute_error(y_true, y_pred),
        "MSE": mean_squared_error(y_true, y_pred),
        "Pearson": pearson_corr,
        "Pearson_p": p_value,
    }
def run_grid_search(X_train, y_train, X_test, y_test, model_configs):
    results = {}
    fitted_models = {}

    for model_name, cfg in model_configs.items():
        print(f"Training {model_name}...")

        search = GridSearchCV(
            estimator=cfg["pipeline"],
            param_grid=cfg["params"],
            cv=5,
            scoring="r2",
            n_jobs=-1,
            refit=True,
        )
        search.fit(X_train, y_train)

        best_model = search.best_estimator_
        y_pred = best_model.predict(X_test)
        metrics = evaluate_predictions(y_test, y_pred)

        results[model_name] = {
            "best_params": search.best_params_,
            "cv_best_r2": search.best_score_,
            **metrics
        }
        fitted_models[model_name] = best_model

        print(
            f"{model_name}: "
            f"CV_R2={search.best_score_:.4f}, "
            f"Test_R2={metrics['R2']:.4f}, "
            f"Pearson={metrics['Pearson']:.4f}, "
            f"MAE={metrics['MAE']:.4f}, "
            f"MSE={metrics['MSE']:.4f}"
        )

    return results, fitted_models
def save_results_txt(results: dict, output_file: str) -> None:
    with open(output_file, "w", encoding="utf-8") as f:
        for model_name, info in results.items():
            f.write(f"{model_name}\n")
            f.write(f"Best params : {info['best_params']}\n")
            f.write(f"CV best R2  : {info['cv_best_r2']:.6f}\n")
            f.write(f"Test R2     : {info['R2']:.6f}\n")
            f.write(f"MAE         : {info['MAE']:.6f}\n")
            f.write(f"MSE         : {info['MSE']:.6f}\n")
            f.write(f"Pearson     : {info['Pearson']:.6f}\n")
            f.write(f"Pearson p   : {info['Pearson_p']:.6f}\n")
            f.write("-" * 50 + "\n")


def save_models(models: dict, output_dir: str) -> dict:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    saved_paths = {}

    for model_name, model in models.items():
        path = os.path.join(output_dir, f"{model_name}_{timestamp}.joblib")
        joblib.dump(model, path)
        saved_paths[model_name] = path
        print(f"Saved: {path}")

    return saved_paths

def plot_feature_importance(model, X_test, y_test, feature_names, title, output_path=None):
    result = permutation_importance(
        model, X_test, y_test, n_repeats=10, random_state=RANDOM_STATE, n_jobs=-1
    )
    importances = result.importances_mean

    plt.figure(figsize=(8, 5))
    plt.bar(feature_names, importances)
    plt.title(title)
    plt.xlabel("Feature")
    plt.ylabel("Permutation Importance")
    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300)
    plt.show()


def plot_learning_curve_like(results: dict, output_path=None):

    model_names = list(results.keys())
    cv_scores = [results[m]["cv_best_r2"] for m in model_names]
    test_scores = [results[m]["R2"] for m in model_names]

    x = np.arange(len(model_names))
    width = 0.35

    plt.figure(figsize=(12, 6))
    plt.bar(x - width / 2, cv_scores, width, label="CV R2")
    plt.bar(x + width / 2, test_scores, width, label="Test R2")
    plt.xticks(x, model_names, rotation=20)
    plt.ylabel("R2")
    plt.title("Model Performance Summary")
    plt.legend()
    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300)
    plt.show()

def plot_prediction_displays(y_true, predictions: dict, kind: str, title: str, output_path=None):
    model_names = list(predictions.keys())
    n_models = len(model_names)
    n_rows = int(np.ceil(n_models / 3))
    n_cols = min(3, n_models)

    fig, axs = plt.subplots(n_rows, n_cols, figsize=(5 * n_cols, 4 * n_rows))
    if n_rows == 1 and n_cols == 1:
        axs = np.array([[axs]])
    elif n_rows == 1:
        axs = np.array([axs])
    elif n_cols == 1:
        axs = axs.reshape(-1, 1)

    for idx, model_name in enumerate(model_names):
        row = idx // 3
        col = idx % 3
        ax = axs[row, col]

        y_pred = predictions[model_name]
        PredictionErrorDisplay.from_predictions(
            y_true=y_true,
            y_pred=y_pred,
            kind=kind,
            ax=ax,
            random_state=RANDOM_STATE,
        )

        metrics = evaluate_predictions(y_true, y_pred)
        ax.set_title(model_name)
        ax.text(
            0.05,
            0.95 if kind == "actual_vs_predicted" else 0.15,
            f"R²={metrics['R2']:.3f}\n"
            f"PCC={metrics['Pearson']:.3f}\n"
            f"MSE={metrics['MSE']:.3f}",
            transform=ax.transAxes,
            verticalalignment="top",
            bbox={"boxstyle": "round", "facecolor": "white", "alpha": 0.7},
        )

    total_axes = n_rows * n_cols
    for idx in range(n_models, total_axes):
        row = idx // 3
        col = idx % 3
        axs[row, col].axis("off")

    fig.suptitle(title)
    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300)
    plt.show()

def prepare_external_data(file_path: str) -> pd.DataFrame:
    df = pd.read_excel(file_path, header=0)
    df = standardize_columns(df)

    required = ["TC", "TG", "HDL-C", "Age", "LDL-C"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(
            f"Missing required columns in external file: {missing}\n"
            f"Available columns: {list(df.columns)}"
        )

    df = df.apply(pd.to_numeric, errors="coerce")
    df = df.dropna(subset=required).reset_index(drop=True)
    return df
def run_external_predictions(df_ext: pd.DataFrame, models: dict) -> pd.DataFrame:
    X_ext = df_ext[["TC", "TG", "HDL-C", "Age"]].copy()

    result_df = df_ext.copy()
    for model_name, model in models.items():
        preds = model.predict(X_ext)
        result_df[model_name] = np.round(preds, 2)

    return result_df
def compare_external_models(df_ext_pred: pd.DataFrame, output_dir: str):
    y_true = df_ext_pred["LDL-C"]

    candidate_models = [
        "Friedewald",
        "Sampson",
        "Martin",
        "RandomForest",
        "GradientBoosting"
    ]
    available_models = [m for m in candidate_models if m in df_ext_pred.columns]
    if not available_models:
        print("No comparison columns found in external file.")
        return
    predictions = {m: df_ext_pred[m].values for m in available_models}
    plot_prediction_displays(
        y_true=y_true,
        predictions=predictions,
        kind="actual_vs_predicted",
        title="External Validation: Actual vs Predicted",
        output_path=os.path.join(output_dir, "external_actual_vs_predicted.png")
    )
    plot_prediction_displays(
        y_true=y_true,
        predictions=predictions,
        kind="residual_vs_predicted",
        title="External Validation: Residual vs Predicted",
        output_path=os.path.join(output_dir, "external_residual_vs_predicted.png")
    )
def assign_tg_category(df: pd.DataFrame) -> pd.DataFrame:
    bins = [-np.inf, 100, 150, 200, 300, 400, np.inf]
    labels = ["<=100", "100-150", "150-200", "200-300", "300-400", ">=400"]
    df = df.copy()
    df["TG_Category"] = pd.cut(df["TG"], bins=bins, labels=labels)
    return df
def calculate_metrics_by_tg_group(df: pd.DataFrame, target_col: str, model_cols: list[str]) -> pd.DataFrame:
    rows = []
    for model in model_cols:
        if model not in df.columns:
            continue

        for tg_cat in df["TG_Category"].cat.categories:
            subset = df[df["TG_Category"] == tg_cat]

            if len(subset) >= 2 and subset[target_col].nunique() > 1 and subset[model].nunique() > 1:
                r2 = r2_score(subset[target_col], subset[model])
                mse = mean_squared_error(subset[target_col], subset[model])
                pcc, pval = pearsonr(subset[target_col], subset[model])
            else:
                r2, mse, pcc, pval = np.nan, np.nan, np.nan, np.nan

            rows.append({
                "Model": model,
                "TG_Category": str(tg_cat),
                "R2": r2,
                "MSE": mse,
                "Pearson": pcc,
                "p_value": pval
            })

    return pd.DataFrame(rows)
def plot_tg_group_metrics(metrics_df: pd.DataFrame, output_path=None):
    if metrics_df.empty:
        print("No TG-group metrics to plot.")
        return

    r2_pivot = metrics_df.pivot(index="TG_Category", columns="Model", values="R2")
    mse_pivot = metrics_df.pivot(index="TG_Category", columns="Model", values="MSE")

    fig, ax1 = plt.subplots(figsize=(12, 8))

    for model in r2_pivot.columns:
        ax1.plot(r2_pivot.index, r2_pivot[model], label=f"{model} R2")

    ax1.set_xlabel("TG Category")
    ax1.set_ylabel("R2")
    ax1.set_ylim(-1, 1)
    ax1.tick_params(axis="x", rotation=25)

    ax2 = ax1.twinx()
    for model in mse_pivot.columns:
        ax2.plot(mse_pivot.index, mse_pivot[model], linestyle="dashed", label=f"{model} MSE")

    ax2.set_ylabel("MSE")

    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc="center left", bbox_to_anchor=(1.02, 0.5))

    plt.title("Performance by TG Category")
    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300)
    plt.show()

def main():
    required_internal_cols = ["TC", "TG", "HDL-C", "Age", "LDL-C", "Gender"]
    data = load_dataset(INTERNAL_FILE, required_internal_cols)
    print("Raw internal dataset:")
    print_basic_statistics(data)
    data = remove_duplicates(data, subset_cols=["TC", "TG", "HDL-C"])
    print("After duplicate removal:")
    print_basic_statistics(data)
    ks_normality_test(data["TC"], "TC")
    feature_cols = ["TC", "TG", "HDL-C", "Age"]
    target_col = "LDL-C"
    X = data[feature_cols].copy()
    y = data[target_col].copy()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )
    print(f"Train shape: {X_train.shape}")
    print(f"Test shape : {X_test.shape}")

    model_configs = build_model_configs()
    results, fitted_models = run_grid_search(X_train, y_train, X_test, y_test, model_configs)
    results_txt = os.path.join(OUTPUT_DIR, "model_results.txt")
    save_results_txt(results, results_txt)
    saved_model_paths = save_models(fitted_models, OUTPUT_DIR)
    print("\nSaved models:")
    for name, path in saved_model_paths.items():
        print(f"{name}: {path}")
    if "RandomForest" in fitted_models:
        plot_feature_importance(
            model=fitted_models["RandomForest"],
            X_test=X_test,
            y_test=y_test,
            feature_names=feature_cols,
            title="Permutation Importance - RandomForest",
            output_path=os.path.join(OUTPUT_DIR, "rf_feature_importance.png")
        )
    test_predictions = {name: model.predict(X_test) for name, model in fitted_models.items()}

    plot_learning_curve_like(
        results,
        output_path=os.path.join(OUTPUT_DIR, "model_performance_summary.png")
    )
    plot_prediction_displays(
        y_true=y_test,
        predictions=test_predictions,
        kind="actual_vs_predicted",
        title="Internal Test: Actual vs Predicted",
        output_path=os.path.join(OUTPUT_DIR, "internal_actual_vs_predicted.png")
    )
    plot_prediction_displays(
        y_true=y_test,
        predictions=test_predictions,
        kind="residual_vs_predicted",
        title="Internal Test: Residual vs Predicted",
        output_path=os.path.join(OUTPUT_DIR, "internal_residual_vs_predicted.png")
    )
    if os.path.exists(EXTERNAL_FILE):
        print("\nLoading external dataset...")
        df_ext = prepare_external_data(EXTERNAL_FILE)
        print_basic_statistics(df_ext)

        df_ext_pred = run_external_predictions(df_ext, fitted_models)

        external_out_path = os.path.join(OUTPUT_DIR, "external_predictions.xlsx")
        df_ext_pred.to_excel(external_out_path, index=False)
        print(f"External predictions saved to: {external_out_path}")

        compare_external_models(df_ext_pred, OUTPUT_DIR)
        df_tg = assign_tg_category(df_ext_pred)
        tg_model_cols = [
            c for c in [
                "Friedewald",
                "Sampson",
                "Martin",
                "RandomForest",
                "GradientBoosting",
            ] if c in df_tg.columns
        ]

        metrics_df = calculate_metrics_by_tg_group(
            df=df_tg,
            target_col="LDL-C",
            model_cols=tg_model_cols
        )

        metrics_csv_path = os.path.join(OUTPUT_DIR, "metrics_by_tg_group.csv")
        metrics_df.to_csv(metrics_csv_path, index=False)
        print(f"TG group metrics saved to: {metrics_csv_path}")

        plot_tg_group_metrics(
            metrics_df,
            output_path=os.path.join(OUTPUT_DIR, "tg_group_metrics.png")
        )
    else:
        print(f"\nExternal file not found: {EXTERNAL_FILE}")
        print("External validation skipped.")


if __name__ == "__main__":
    main()