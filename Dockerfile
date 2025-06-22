# maven with temurin 17 jdk image
FROM maven:3.9.9-eclipse-temurin-21 as builder
RUN ls -la
COPY frontend /home/frontend
COPY backend /home/backend
RUN mvn -f /home/backend/pom.xml clean install

FROM eclipse-temurin:21
COPY --from=builder /home/backend/target/backend-0.0.1-SNAPSHOT.jar /home/backend-0.0.1-SNAPSHOT.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/home/backend-0.0.1-SNAPSHOT.jar"]