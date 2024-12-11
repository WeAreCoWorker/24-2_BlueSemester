FROM openjdk:17-jdk
LABEL authors="kando"
WORKDIR /digitaleye
COPY build/libs/*SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/digitaleye/app.jar"]