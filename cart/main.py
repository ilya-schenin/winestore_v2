from fastapi import FastAPI
from cart.views import router
import uvicorn
from starlette.middleware.cors import CORSMiddleware

# import sys
# import os
#
# sys.path.append(os.path.abspath(os.path.dirname(__file__)))

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

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
