---
layout: single
title: "Hybrid Recommendation Engine for Optimal Neighborhood Selection"
permalink: /projects/data-science-capstone/
summary: "Developed a hybrid machine learning recommendation system that combines K-Means clustering and KNN to deliver personalized neighborhood rankings using public and proprietary housing, safety, and amenity data."
date: 2020-09-18
categories: [Recommendation Systems, Machine Learning, Capstone]
tags: [K-Means, KNN, Clustering, Personalization, Python, Data Science Capstone]
---

## Project Overview

The Applied Data Science Capstone project centered on building a **hybrid machine learning recommendation engine** to identify optimal living environments for users. The system integrates unsupervised and supervised learning. First, neighborhoods were clustered using K-Means, then K-Nearest Neighbors (KNN) was leveraged to generate ranked, personalized neighborhood recommendations based on user preferences and lifestyle data.

## Methodology

### Data Sources
- Aggregated neighborhood-level data from Zillow, US Census, city datasets, and real estate APIs.
- Key features included affordability, crime, walkability, schools, transit, and amenities.

### Feature Engineering
- Standardized and scaled all features for clustering.
- Principal Component Analysis (PCA) used to reduce feature dimensionality where appropriate.
- Categorical features (e.g., “Dog friendly”) one-hot encoded for inclusion in clustering and KNN stages.

### Hybrid Modeling Pipeline

- **Stage 1: K-Means Clustering**
  - Grouped neighborhoods into clusters with similar profiles (housing, safety, lifestyle).
  - Identified macro-level fit for user preferences
  - Users only compared to neighborhoods in their best-fit cluster.
- **Stage 2: K-Nearest Neighbors (KNN) Personalization**
  - For a given user, identified similar user-neighborhood preference pairs within the cluster using KNN.
  - Produced a personalized, ranked shortlist of ideal neighborhoods.

### Evaluation & Validation

- Qualitative validation against ground-truth preferences (benchmarking against known “best” neighborhoods for different user profiles).
- User-centric scoring: Recommendations cross-validated via scenario testing (e.g., single professionals, families, pet owners).

## Key Results

- The engine delivered actionable, interpretable neighborhood recommendations for a wide range of user profiles.
- The two-layer pipeline (“cluster first, personalize second”) improved both the relevance and diversity of recommendations compared to single-stage approaches.
- Visualization of clusters and ranked recommendations allowed clear communication to end-users and stakeholders.

## Tools & Technologies

- **Languages:** Python
- **Libraries:** scikit-learn (KMeans, KNN), pandas, numpy, matplotlib, seaborn
- **Deployment:** Jupyter Notebooks, GitHub

## GitHub Repository & Additional Links

- [GitHub: Full code and documentation](https://github.com/schwill2018/applied_datascience_capstone)
- [LinkedIn Article: Dual-Layer Recommendation Engine Summary](https://www.linkedin.com/pulse/dual-supervision-recommendation-engine-find-ideal-living-schneider/)

## Conclusion & Future Work

This hybrid recommendation system offers interpretable, actionable advice for users seeking an ideal place to live, combining data-driven neighborhood segmentation with personalized, scenario-based ranking. Future extensions could integrate real-time user feedback, additional lifestyle variables, and direct web-app deployment for broader accessibility.
