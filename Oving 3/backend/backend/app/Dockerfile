FROM cpp-build-base:0.1.0 AS build

WORKDIR /src

COPY main.cpp CMakeLists.txt ./
RUN cmake . && make

FROM ubuntu:bionic

WORKDIR /opt/project


COPY --from=build /src/ ./

CMD ["./main"]