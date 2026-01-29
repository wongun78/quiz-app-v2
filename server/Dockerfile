FROM gradle:8.5-jdk21 AS build

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradle.properties .

RUN chmod +x ./gradlew && ./gradlew dependencies --no-daemon

COPY src src

RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre

LABEL maintainer="Quiz Application"
LABEL description="Spring Boot Quiz REST API"

RUN groupadd --system spring && useradd --system --gid spring spring

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

RUN chown -R spring:spring /app

USER spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-Xms256m -Xmx384m -XX:+UseSerialGC -XX:MaxMetaspaceSize=128m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
