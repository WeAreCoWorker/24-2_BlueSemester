# Getting Started

## Github Secret
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- EXTERNAL_KEY: `application-API-KEY.properties` 
- EXTERNAL_KEL: `application-uri.properties` 

## Add Properties Files
- `touch ./src/main/resources/application-API-KEY.properties`

  ``` 
  deepL-admin-key=DeepL Api Key
  weather-key=골공데이터포털 Api Key
  ```
- `touch ./src/main/resources/application-uri.properties`

  ```
  flask.base.url=AI Serving Server BaseUrl
  ```
## Build & Run DockerFile
- `docker build -t digitaleye:tag .`
- `docker run -it -p 8080:8080 digitaleye`