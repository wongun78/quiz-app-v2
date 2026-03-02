terraform {
  backend "gcs" {
    bucket = "kien-terraform-playground-tfstate"
    prefix = "quiz-app"
  }
}
