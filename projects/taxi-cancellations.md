---
layout: page
title: "Taxi Cancellations: A Predictive Model Analysis"
permalink: /projects/taxi-cancellations/
summary: "Developed an ensemble machine learning framework in R to predict taxi ride cancellations, addressing class imbalance through SMOTE and prioritizing specificity for actionable business impact."
description: "Predictive modeling project in R using ensemble methods and SMOTE to forecast taxi ride cancellations and improve operational decision-making."
date: 2024-04-01
categories: [Predictive Modeling, Machine Learning, Operations Analytics]
tags: [Taxi Cancellations, SMOTE, Specificity, Ensemble Modeling, R, Random Forest, KNN, AdaBoost]
---

## Project Overview

This project aimed to optimize taxi service reliability and operational efficiency by building predictive models for ride cancellations. Through advanced data preprocessing, feature engineering, and ensemble modeling, the project delivered actionable tools for minimizing financial losses and improving customer satisfaction for taxi service providers.

## Methodology

### Data Sources
- Proprietary taxi trip dataset: 10,000 records and 23 attributes, including geographic coordinates, trip length, booking method, time and day of trip, and cancellation status.

### Data Preprocessing & Feature Engineering
- Addressed missing values (initially replaced with 0, explored alternatives).
- Converted date/time into meaningful temporal features (day of week, time of day).
- Calculated trip length from GPS data.
- Transformed key predictors to factors where appropriate.
- Managed significant class imbalance in cancellations.

### Modeling Pipeline

- **Base Models:** K-Nearest Neighbors (KNN), Decision Tree, Random Forest, Logistic Regression, Penalized Regression, AdaBoost
- **Ensemble:** Combined model strengths for superior performance
- **Class Imbalance Handling:**  
  - Applied **SMOTE** to upsample rare cancellation cases.
  - Random Forest and AdaBoost further tuned with instance weighting.
- **Custom Scoring:**  
  - Developed a custom metric focused on **specificity** (true negative rate) due to the higher cost of false positives.

### Evaluation & Validation

- Metrics: **Specificity**, AUC, Accuracy, Sensitivity
- Rolling holdout validation to assess performance on unseen data
- Variable importance analysis to identify key cancellation predictors

## Key Results

- **Ensemble model** achieved the highest AUC (0.94) and highest specificity (0.84), outperforming all textbook baseline models.
- **SMOTE** improved detection of cancellations (true negative rate improved by over 250% in some models).
- **Model accuracy:** 0.876 (ensemble), with logistic regression and random forest close behind.
- **Sensitivity:** 0.25–0.1 across models, indicating room for improved detection of true positives.
- Variables such as trip length, booking type (online vs mobile), and pickup/dropoff location were significant predictors of cancellation.

## Tools & Technologies

- **Languages:** R
- **Libraries:** caret, randomForest, DMwR (SMOTE), AdaBoost, ggplot2

## GitHub Repository & Additional Resources

- [**GitHub: Taxi Cancellations Predictive Analysis**](https://github.com/schwill2018/Taxi-Cancellations---A-Predictive-Model-Analysis/tree/main)

## Conclusion & Business Implications

By prioritizing specificity and handling class imbalance, our models deliver robust, actionable predictions for taxi ride cancellations. The approach enables taxi platforms to reassign rides proactively, reduce operational losses, and improve customer trust. Future directions include real-time deployment, refined feature engineering, and generalizing the model for other mobility services.
