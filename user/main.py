import uvicorn
import threading
from fastapi import FastAPI
from auth.views import router
from auth.consumer import UserConsumerJWT
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


jwt_consume = UserConsumerJWT()


def run_uvicorn():
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)


if __name__ == "__main__":
    jwt_thread = threading.Thread(target=jwt_consume.start_consuming)
    jwt_thread.start()
    run_uvicorn()
    jwt_thread.join()

