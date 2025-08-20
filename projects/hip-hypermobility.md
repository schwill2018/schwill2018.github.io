---
layout: page
title: "Statistical Analysis of Hip Hypermobility and Psychosocial Outcomes"
permalink: /projects/hip-hypermobility/
summary: "Applied linear and logistic regression with multiple imputation to clinical data, assessing the relationship between hip hypermobility and psychosocial variables in 445 patients. Results published with an interactive Shiny dashboard."
date: 2024-12-18
categories: [Statistical Modeling, Clinical Analytics]
tags: [Hypermobility, Psychosocial Outcomes, Regression, Multiple Imputation, Shiny App, Healthcare Analytics]
---

## Project Overview

This project investigates whether psychosocial factors such as pain catastrophizing, pain interference, and pain self-efficacy predict hip hypermobility (Beighton Score) in a clinical population. Leveraging robust statistical methods and reproducible analytics, the analysis provided actionable findings for clinicians and researchers. Using both multiple linear regression and multiple imputation, we found:

- **Key predictors of hypermobility are age and gender, not psychosocial scores**
- **Younger females tend to have higher hypermobility**
- **Pain and self-efficacy scores showed little/no association with Beighton Score**


## Methodology

- **Data**: 445 patients from a Baylor Scott & White hip clinic with Beighton Score, age, gender, and three psychosocial surveys (PCS, PROMIS-PI, PSEQ)
- **Outcome:** Beighton Score (continuous; dichotomized for logistic regression)
- **Predictors:** Age, gender, pain catastrophizing (PCS), pain interference (PROMIS-PI), pain self-efficacy (PSEQ)
- **Handling Missing Data**: Used Multiple Imputation by Chained Equations (MICE) to address 47–64% missingness in psychosocial variables
- **Statistical Analysis**:
    - Multiple Linear Regression (MLR) for continuous Beighton Score
    - Post-hoc Logistic Regression for dichotomized outcome (≥4 vs <4)
    - Age and gender included as covariates; all models checked for multicollinearity and validated via diagnostic plots

## Key Results

- **Age** and **gender** were the only significant predictors:  
  - Younger females exhibited higher Beighton Scores (males scored ~3.7 points lower, age slope ~-0.06 per year)
- **Psychosocial outcomes:** No significant association found in either linear or logistic regression, regardless of missing data strategy
- **Model diagnostics:** No problematic multicollinearity; regression assumptions verified- No significant association found between psychosocial measures (PCS, PROMIS-PI, PSEQ) and hypermobility, regardless of imputation method

## Tools & Technologies

- **Languages**: R
- **Libraries**: mice, broom, ggplot2, modelsummary

## Visualizations & Report

- Regression coefficient plots, imputation diagnostics, confidence interval visualizations
- [**Full Project Report (PDF)**](/HypermobilityReport_Schneider_Taylor_final.pdf)

## Interactive Dashboard

Explore all results and rerun analyses with new data:
- [Interactive Shiny App**](https://schneiderstats.shinyapps.io/hypermobility_app/)

## Further Reading

- **[Blog Post: Exploring the Relationship Between Hip Hypermobility and Psychosocial Outcomes]**(/hypermobility_blog.html)

## Conclusion & Next Steps

- Psychosocial screening did not enhance risk assessment for hypermobility in this clinical sample.
- Future research: Apply methods to general-population data to clarify external validity; explore additional biopsychosocial predictors.
