---
title: "Hip Hypermobility Analysis: What Actually Matters?"
layout: post
date: 2024-12-01
categories: research
---

## Executive Summary

This project investigated whether psychosocial factors like pain catastrophizing, pain interference, and pain self-efficacy are meaningfully associated with joint hypermobility, as measured by Beighton Score, among hip clinic patients. Using both multiple linear regression and multiple imputation, we found:

- **Key predictors of hypermobility are age and gender, not psychosocial scores**
- **Younger females tend to have higher hypermobility**
- **Pain and self-efficacy scores showed little/no association with Beighton Score**

A custom [interactive Shiny app](https://schneiderstats.shinyapps.io/hypermobility_app/) allows anyone to explore the dataset, regression results, and missing data handling interactively.

---

## Background

Prior studies suggest a relationship between hypermobility and injury risk, and between injury and psychosocial outcomes. However, research directly linking hypermobility to psychosocial outcomes is lacking. This project fills that gap by analyzing a prospectively gathered dataset from a hip clinic (N=445).

---

## Methods

- **Outcome:** Beighton Score (continuous; dichotomized for logistic regression)
- **Predictors:** Age, gender, pain catastrophizing (PCS), pain interference (PROMIS-PI), pain self-efficacy (PSEQ)
- **Missing Data:** Addressed via MICE and KNN imputation
- **Analysis:** Multiple linear regression (MLR) and logistic regression (post-hoc dichotomization)

---

## Results

- **Age and gender:** Statistically significant predictors (Beighton Score decreases by ~0.06 per year of age, males ~4 points lower than females)
- **Psychosocial outcomes:** No significant association found in either linear or logistic regression, regardless of missing data strategy
- **Model diagnostics:** No problematic multicollinearity; regression assumptions verified

---

## Conclusion

Contrary to expectations, pain-related psychosocial scores were not associated with hypermobility in this clinical sample. This implies that, for patients already seeking orthopedic care, physical predictors are dominant. Broader general-population research is needed to assess causality outside of clinical selection bias.

**Try the dashboard:** [https://schneiderstats.shinyapps.io/hypermobility_app/](https://schneiderstats.shinyapps.io/hypermobility_app/)

*Full source code and details on request.*

---

## Project Credits

- **Research & Analysis:** Will Schneider, Ellen Taylor
- **Dashboard Development:** Will Schneider, Ellen Taylor

