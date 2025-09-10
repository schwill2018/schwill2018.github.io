---
layout: post
title: "Forecasting Fleet Utilization & Maintenance: A DS View (Redacted)"
date: 2025-09-09 12:00 -0500
categories: [Time Series, Operations]
tags: [Time Series, ARIMA, Vector Auto Regression, Forecasting, Aircraft]
description: "How flight hours drive maintenance planning, written for data folks with an operations heartbeat."
math: true
---

> **Redaction badge:** Tail numbers identifying specific aircraft have been removed.

## Why I did this and why now

I started this work in Spring 2025 while taking a grad course on time series. It also happened to be the most obvious time series sitting on my desk at work. Two airframes. Monthly flight hours. Monthly maintenance costs. The question basically asked itself.

There’s an old line about business aviation: if the jet isn’t flying, it’s hemorrhaging money. That does not mean grounded time causes more maintenance. It means fixed costs tick on either way, so flying helps offset them, and honestly some issues are easier to catch in the air than on the ramp. The practical version of that idea is what I wanted to quantify. If hours are the driver, can I turn them into a month-ahead maintenance number logistics specialist could actually use?

This post walks the path I took to answer that, then points you to the executive-friendly report. The exec read keeps the conclusions and trims the jargon. This one keeps the signal.

**Aircraft and windows**
Global Express (GLEX): Apr-2021 to Jul-2025
Learjet 60: May-2022 to Jul-2025

## What the data say at a glance

The first pass was decomposition. What shows up if you peel trend and seasonality away from the noise. Then I checked autocorrelation and basic spectra. There isn’t much forecastable seasonality that survives those checks. ARIMA does not grab a strong seasonal pattern either, which already tells you something about how far you can push a forecast before you leave the lane.

Hours are the driver. Maintenance responds with small lags and cost pulses. Both lose memory fast. On the GLEX you can see a quarterly pulse in maintenance while hours hum along in short runs. On the Lear 60 you see a steady baseline after logging, then the occasional spike that is clearly event-driven. That difference matters for planning. (rhythmic for GLEX and tactical for Lear 60). It also explains why most of the useful guidance lives at short horizons.

Short horizons carry signal because the system has a short memory. Hours cluster for a few months at a time. Maintenance reacts in the same window. That gives you usable guidance for the next one to four months, but past that, the patterns jitter. GLEX’s quarterly wave drifts in phase. Lear 60 never locks into a repeatable rhythm. Real life barges in: vendor slots, parts delays, inspections that slide, and one-off events. At that point you are not forecasting a pattern so much as trying to time future surprises. Anything beyond four months behaves more by one-off events than by time-series components.

For all results below I report 95 percent intervals for horizons 1 through 4. That is the operational window that matters.

## The GLEX story

GLEX breathes in quarters. Costs pulse, then back off, then pulse again. Hours are not wild, but they have a two to three month operating rhythm with real near-term persistence. Put those together and you get planning signal you can act on for one to four months.

Practical translation: stage parts near the quarterly crests, shift lighter work into troughs, and set short labor bands to the 2–3 month rhythm. My role here is surfacing the 1–4 month signal behind that.

What the charts show: the seasonal bump repeats roughly each quarter, the hours ACF stays positive for a couple of lags and then falls off, and the hours→maintenance cross‑correlation peaks at 0–1 months. That is why the same‑month VARX nowcast works and why the next 1–4 months keep their shape before phase drift takes over.

## The Lear 60 story

The Lear 60 is steady until it isn’t. After logging, maintenance sits on a routine baseline and then throws spikes that are clearly event‑driven. Hours are choppy with little persistence and no durable seasonal pattern, so most of the usable guidance lives in the short run.

Practical translation: keep tight parts buffers, shorter staffing bands, and plan tactically for one‑off work. Use the model for 1–3 month calls and avoid over‑promising anything beyond that.

What the charts show: decomposition yields a flat trend line with small seasonal fingerprints that do not survive diagnostics. The hours ACF fades quickly, the maintenance residuals look close to white, and the hours→maintenance cross‑correlation tops out at 0–1 months and then drops. Same‑month VARX adds a bit when $H_t$ (the realized flight hours in the current month) is known; for $h>1$ the models lean toward baseline behavior fast, intervals widen, and any “cycle” you think you see is wishful thinking. This is why Lear 60 stays a 1–3 month tactical instrument and beyond that becomes event‑driven.

## Methods in plain words

When it came to methods, I kept the philosophy simple: only add complexity if the data earn it. That makes the workflow easier to follow and the results easier to explain.

The first step is decomposition, just to see how much of the shape is trend versus seasonality before any model tries to fit itself. If the time series looks stable enough on its own (without other drivers) under diagnostics, I turn to ARIMA, selecting orders with AICc/BIC and stationarity checks. When the real question is how hours drive maintenance, I bring in VAR or VARX: maintenance stays endogenous while hours act as the driver.

That naturally splits the work into two scenarios:

1) **Same‑month nowcast**: If I already know the current month’s hours, I can plug them straight in. VARX with $H_t$ and a couple of lags gives a same‑month maintenance estimate before the invoices finish arriving.

2) **Month‑ahead forecast**: If I don’t know the hours yet, I either run a VAR without them or supply an hours path. That way the two series still move together rather than drifting apart.

The usual guardrails apply: check residuals for whiteness, glance at the ACF/PACF, confirm AR and VAR roots are inside the unit circle. I only difference when the diagnostics say it’s necessary. The simplest adequate model wins.

## Validation and what “skill” actually means here

Operations live in the $h=1$ to $h=4$ interval, and is what I care about most. I use rolling origin over the last stretch of history and compare against the simple baselines. For GLEX there is persistent, practical skill over seasonal-naïve and ETS at the short horizons. For Lear 60 the models earn their keep mostly in h = 1 to 3 and then look more like noise filters.

Two checks help frame the results:

- **Forecast intervals** in the analysis targets 95% coverage. Realized outcomes should fall inside the 95% band most of the time on recent history. Wider bands = lower confidence.
- **Robustness** is more important than a single good-looking fit. If small tweaks in lag length or differencing change the outcome completely (and believe me, through testing, they more than did!) the model is fragile and planners should treat the result cautiously.

In technical shorthand: autocorrelation for hours and maintenance drops near zero by lags 3 to 4. Cross‑correlation shows only short leads from hours to maintenance. Backtests converge toward the baselines after a quarter as interval widths approach the unconditional variance. That marks the short‑memory, event‑driven boundary.

## What this changes for planning

The results are aimed at near‑term budgeting and scheduling. They could also inform detailed operational tasks such as parts ordering or shop assignments, but those fall outside the scope of this particular analysis. The short‑memory structure gives guidance on how to frame expectations rather than dictating exact actions.

- **Budgets**: set cost ranges that reflect the short‑horizon signal and avoid false precision beyond a quarter.
- **Staffing**: adjust labor expectations to the 2–3 month rhythm where it shows up (GLEX) and keep them shorter and tactical where it does not (Lear 60).
- **Scheduling**: align higher‑load periods with the GLEX quarterly pulse and leave contingency room for Lear 60’s one‑off spikes.

The models do not replace operational expertise. But they provide a consistent way to describe near‑term expectations that complement how these aircraft already behave.

## Risks, limits, and redaction

Regime shifts and vendor changes rewrite the script. Reporting lag can smear month boundaries. Redaction hides magnitudes, so small effects may look even smaller on the page. Lear 60’s early span is shorter than GLEX, so any longer cycle would need more history to confirm. Looking ahead, a natural extension would be to bring Chartered Hours into the analysis. That addition could sharpen scheduling forecasts by linking office aircraft use with charter operations. That is the lay of the land, not an apology for modeling.

## Want the friendly read or the code

If you are an executive and made it this far, bravo and congratulations. Your proverbial work shoes are probably stained by the proverbial weeds you have been in for the last 30 minutes. That kind of endurance deserves a high‑level version (HTML below). For readers interested in the technical side, the full source is also linked.

**Open the executive HTML report:**
**👉 [View the report]({{ '/files/2025-09-10-aircraft-ts-report.html' | relative_url }})**

**Browse the source and the rendered artifact:**
**👉 <https://github.com/schwill2018/aircraft-ts-analysis>**

*Implementation notes for the curious:* Models used here include ARIMA for univariate structure checks and VAR/VARX for the joint hours-maintenance relationship. VARX was applied for same-month maintenance when hours were known, while for $h > 1$ an hours path was supplied so maintenance and hours forecasts stayed aligned. Intervals were reported at the 95% level for horizons 1 to 4, which is the decision window emphasized in this analysis.
