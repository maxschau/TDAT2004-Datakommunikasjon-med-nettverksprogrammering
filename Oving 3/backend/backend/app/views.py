import subprocess
import os
import shlex
import sys
from subprocess import Popen, PIPE
from django.http import HttpResponse, JsonResponse
from shlex import split
from django.views.decorators.csrf import csrf_exempt

def index(request):
    response = HttpResponse("Hello, world. You're at the polls index.")
    return response


@csrf_exempt
def getMessage(request):


    #Creates the main.cpp file
    f = open("./app/main.cpp", "w")
    #Writes the code to the file
    f.write(request.body)
    f.close()



    #Run the docker here

    s = subprocess.check_output("cd app/;docker build . -t myapp", shell = True)
    res = subprocess.check_output("cd app/; docker run --rm myapp", shell = True)



    response = JsonResponse([s, res], safe=False)


    #
    #End running docker here



    response["Access-Control-Allow-Origin"] = "http://127.0.0.1:8000/"
    response["Access-Control-Allow-Origin"] = "*"
    response['Access-Control-Allow-Methods'] = 'GET,PUT,OPTIONS, POST,DELETE'
    response["Access-Control-Allow-Headers"] = "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, authorization"

    return response


