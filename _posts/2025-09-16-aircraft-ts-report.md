---
layout: post
title: "Forecasting Fleet Utilization & Maintenance: A DS View (Redacted)"
date: 2025-09-16 12:00 -0500
categories: [Time Series, Operations]
tags: [Time Series, ARIMA, Vector Auto Regression, Forecasting, Aircraft]
description: "How flight hours drive maintenance planning, written for data folks with an operations heartbeat."
math: true
---

*Note on the data:*
The figures shown here have been redacted and transformed to protect proprietary aircraft records. Tail numbers identifying specific aircraft have been removed. Original maintenance and flight-hour data were scaled, jittered, and shifted so that the overall patterns remain intact, but the exact dollar amounts and usage figures are not real. Think of it as a “blur filter” for time-series: you can still see the structure of peaks, valleys, and relationships, but the sensitive business details stay private.

## Why I did this and why now

I began this analysis in the spring of this year while taking a graduate course on time series analysis, and I have continued to produce monthly reports. This aircraft data was the most obvious time series on my desk at work. Two airframes, monthly flight hours, and monthly maintenance costs. The question practically asked itself.

There’s an old line about business aviation: if the jet isn’t flying, it’s hemorrhaging money. That does not mean grounded time causes more maintenance. It means fixed costs are incurred either way, so flying helps offset them, and honestly, some issues are easier to catch in the air than on the tarmac. The practical version of that idea is what I wanted to quantify. If hours are the driver, can I convert them into a month-ahead maintenance schedule that a logistics specialist can actually use?

This post walks the path I took to answer that, then points you to the executive-friendly report. The exec read keeps the conclusions and trims the jargon. This one keeps the signal.

**Aircraft and windows**
Global Express (GLEX): Apr-2021 to Jul-2025
Learjet 60: May-2022 to Jul-2025

## What the data say at a glance

The first pass was decomposition. What remains if trend and seasonality are peeled away from the noise? Then I checked autocorrelation and basic spectra. There isn’t much forecastable seasonality that survives those checks. ARIMA does not grab a strong seasonal pattern either, which already tells you something about how far you can push a forecast before you leave the lane.

Hours are the driver. Maintenance responds with slight lags and cost pulses. Both lose memory fast. On the GLEX, you can see a quarterly pulse in maintenance, while hours are maintained in short runs. On the Lear 60, you see a steady baseline after logging, followed by occasional spikes that are clearly event-driven. That difference matters for planning. (rhythmic for GLEX and tactical for Lear 60). It also explains why most useful guidance tends to reside at short horizons.

Short horizons carry signal because the system has a short memory. Hours cluster for a few months at a time. Maintenance reacts in the same window. That gives you usable guidance for the next one to four months, but beyond that, the patterns become erratic. GLEX’s quarterly wave drifts in phase. Lear 60 never locks into a repeatable rhythm. Real life barges in: vendor slots, parts delays, inspections that slide, and one-off events. At that point, you are not forecasting a pattern so much as trying to time future surprises. Anything beyond four months behaves more like one-off events than time-series components.

For all results below, I report 95 percent intervals for horizons 1 through 4. That is the operational window that matters.

## The GLEX story

GLEX breathes in quarters. Costs pulse, then back off, then pulse again. Hours are not wild, but they have a two- to three-month operating rhythm with real near-term persistence. Put those together, and you get a planning signal you can act on for one to four months.

Practical translation: stage parts near the quarterly crests, shift lighter work into troughs, and set short labor bands to the 2–3 month rhythm. My role here is surfacing the 1–4 month signal behind that.

What the charts show: the seasonal bump repeats roughly each quarter, the hours ACF stays positive for a couple of lags and then falls off, and the hours→maintenance cross‑correlation peaks at 0–1 months. That is why the same‑month VARX nowcast works and why the next 1–4 months keep their shape before phase drift takes over.

## The Lear 60 story

The Lear 60 is steady until it isn’t. After logging, maintenance sits on a routine baseline and then throws spikes that are clearly event‑driven. Hours are choppy, with little persistence and no durable seasonal pattern, so most usable guidance is limited to the short run.

Practical translation: keep tight parts buffers, shorter staffing bands, and plan tactically for one‑off work. Use the model for calls of 1–3 months and avoid over-promising anything beyond that.

What the charts show: decomposition yields a flat trend line with small seasonal fingerprints that do not survive diagnostics. The hours ACF fades quickly, the maintenance residuals appear close to white, and the hours→maintenance cross-correlation peaks at 0–1 months and then declines. Same‑month VARX adds a bit when $H_t$ (the realized flight hours in the current month) is known; for $h>1$ the models lean toward baseline behavior fast, intervals widen, and any “cycle” you think you see is wishful thinking. This is why Lear 60 remains a 1–3 month tactical instrument, and beyond that, it becomes event-driven.

## Methods in plain words

When it came to methods, I kept the philosophy simple: only add complexity if the data earn it. That makes the workflow more straightforward to follow and the results easier to explain.

The first step is decomposition, which allows us to see how much of the shape is due to trend versus seasonality before any model attempts to fit itself. If the time series appears stable enough on its own (without other drivers) under diagnostics, I turn to ARIMA, selecting orders based on AICc/BIC and stationarity checks. When the real question is how hours drive maintenance, I bring in VAR or VARX: maintenance stays endogenous while hours act as the driver.

That naturally splits the work into two scenarios:

1) **Same‑month nowcast**: If I already know the current month’s hours, I can plug them straight in. VARX with $H_t$ and a couple of lags yields the same-month maintenance estimate before the invoices are fully received.

2) **Month‑ahead forecast**: If I don’t know the hours yet, I either run a VAR without them or supply an hours path (average, predicted, etc., there are many ways to do this). This allows the two series to still move together rather than drifting apart.

The usual guardrails apply: checking residuals for whiteness, unpacking the ACF/PACF, and confirming AR and VAR roots are inside the unit circle. The only difference is when the diagnostics say it’s necessary. The simple model wins.


## Validation

To validate the analysis, I performed a rolling origin backtest over a six-month window. Both aircraft confirm the short‑horizon picture: the Global's sweet spot is h = 1–4, while the Lear holds value mainly at h = 1–3 before fading toward noise.

**Considerations:**

- **Forecast intervals** provide a sense of the uncertainty surrounding the prediction. A 95% interval means that if we repeated this process many times, we expect the intervals to contain the actual outcome 95% of the time.

- **Robustness** is more important than a single good-looking fit. If minor tweaks in lag length or differencing change the outcome entirely, the model is sensitive, and this forecast is fixed to the model's assumptions and data.

- **In technical shorthand**: autocorrelation for hours and maintenance drops near zero around lags 3 to 4. Cross‑correlation plots only show short leads from hours to maintenance. Backtests converge toward the baselines after a quarter as interval widths approach the unconditional variance. That marks the short‑memory, event‑driven boundary.

## What this changes for planning

The results are intended for near-term budgeting and scheduling. They could also inform detailed operational tasks such as parts ordering or shop assignments, but those fall outside the scope of this particular analysis. The short‑memory structure gives guidance on how to frame expectations rather than dictating exact actions.

- **Budgets**: set cost ranges that reflect the short‑horizon signal and avoid false precision beyond a quarter.
- **Staffing**: adjust labor expectations to the 2–3 month rhythm where it shows up (GLEX) and keep them shorter and tactical where it does not (Lear 60).
- **Scheduling**: align higher‑load periods with the GLEX quarterly pulse and leave contingency room for Lear 60’s one‑off spikes.

The models do not replace operational expertise. However, they provide a consistent way to describe near-term expectations that complements how these aircraft already behave.

## Risks, limits, and redaction

Regime shifts and vendor changes rewrite the script. Reporting lag can smear month boundaries. Redaction hides magnitudes, so small effects may look even smaller on the page. Lear’s early span is shorter than GLEX, so any longer cycle would require more history to confirm. Looking ahead, a natural extension would be to bring Chartered Hours into the analysis. That addition could sharpen scheduling forecasts by linking office aircraft use with charter operations. That is the lay of the land, not an apology for modeling.

## Want the friendly read or the code

If you are an executive and made it this far, bravo and congratulations. Your proverbial work shoes are probably stained by the proverbial weeds you have been in for the last 30 minutes. That kind of endurance deserves a high‑level version (HTML below). For readers interested in the technical side, the full source is also available.

**Open the executive HTML report:**
**👉 [View the report]({{ '/files/2025-09-10-aircraft-ts-report.html' | relative_url }})**

**Browse the source and the rendered artifact:**
**👉 <https://github.com/schwill2018/aircraft-ts-analysis>**

*Implementation notes for the curious:* Models used here include ARIMA for univariate structure checks and VAR/VARX for the joint hours-maintenance relationship. VARX was applied for same-month maintenance when hours were known, while for $h > 1$ an hours path was supplied so maintenance and hours forecasts stayed aligned. Intervals were reported at the 95% level for horizons 1 to 4, which is the decision window emphasized in this analysis.
