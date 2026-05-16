from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AliasChoices, BaseModel, ConfigDict, Field
import os
import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "models/XGBoost_Model.joblib"
DATASET_PATH = "datasetLDL.xlsx"


def _standardize_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename_map = {
        "HDL": "HDL-C",
        "HDL_C": "HDL-C",
        "HDLC": "HDL-C",
        "AGE": "Age",
        "age": "Age",
        "LDL": "LDL-C",
        "LDL_C": "LDL-C",
        "LDLC": "LDL-C",
    }
    return df.rename(columns=rename_map)


def _train_fallback_model() -> Pipeline:
    if not os.path.exists(DATASET_PATH):
        raise RuntimeError(
            f"Model load failed and training dataset is missing: {DATASET_PATH}"
        )

    df = pd.read_excel(DATASET_PATH)
    df = _standardize_columns(df)
    required = ["TC", "TG", "HDL-C", "Age", "LDL-C"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise RuntimeError(f"Training dataset is missing required columns: {missing}")

    df = df[required].apply(pd.to_numeric, errors="coerce").dropna().reset_index(drop=True)
    X = df[["TC", "TG", "HDL-C", "Age"]]
    y = df["LDL-C"]

    fallback_model = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
        ("model", GradientBoostingRegressor(random_state=42)),
    ])
    fallback_model.fit(X, y)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(fallback_model, MODEL_PATH)
    return fallback_model


def load_or_train_model():
    try:
        return joblib.load(MODEL_PATH)
    except Exception as exc:
        print(f"Warning: failed to load model from {MODEL_PATH}: {exc}")
        print("Training a fallback model from datasetLDL.xlsx...")
        return _train_fallback_model()


model = load_or_train_model()


class feature_request(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    TC: float
    HDL_C: float = Field(validation_alias=AliasChoices("HDL-C", "HDL_C"))
    TG: float
    Age: int = Field(default=45, ge=0, le=120)

def friedewald(tc, hdl, tg):
    return tc - hdl - tg / 5


def martin(tc, hdl, tg):
    return tc - hdl - tg / 6  


def sampson(tc, hdl, tg):
    return tc - hdl - (tg / 8) + (tg * tg / 3000)


def ldl_category(ldl):
    if ldl < 100:
        return "Optimal"
    elif ldl < 130:
        return "Near optimal"
    elif ldl < 160:
        return "Borderline high"
    elif ldl < 190:
        return "High"
    else:
        return "Very high"


def tg_status(tg):
    if tg < 150:
        return "Normal"
    elif tg < 200:
        return "Borderline"
    elif tg < 500:
        return "High"
    else:
        return "Very High"

@app.get("/")
def root():
    return {"message": "API is working"}

@app.post("/predict")
async def predict(features: feature_request):

    tc = features.TC
    hdl = features.HDL_C
    tg = features.TG
    age = features.Age
    data = {
        "TC": [tc],
        "TG": [tg],
        "HDL-C": [hdl],
        "Age": [age]
    }

    df = pd.DataFrame(data)

    ml_prediction = float(model.predict(df)[0])

    fried = friedewald(tc, hdl, tg)
    mart = martin(tc, hdl, tg)
    samp = sampson(tc, hdl, tg)
    print(f"Prediction: {ml_prediction}, Friedewald: {fried}, Martin: {mart}, Sampson: {samp}")
    return {
        "LDL-C": round(ml_prediction, 2),
        "lipidai": round(ml_prediction, 2),
        "friedewald": round(fried, 2),
        "martin": round(mart, 2),
        "sampson": round(samp, 2),
        "tg_status": tg_status(tg),
        "ldl_category": ldl_category(ml_prediction)
    }