---
layout: page
title: "Wide and Deep Learning: Custom Multi-Layer Perceptron from Scratch"
permalink: /projects/wide-and-deep-learning/
summary: "Engineered a multi-layer perceptron (MLP) from scratch in Python using object-oriented programming, demonstrating foundational and advanced deep learning concepts, interpretability, and extensibility without reliance on high-level libraries."
date: 2024-07-01
categories: [Deep Learning, Neural Networks, Python]
tags: [Multi-Layer Perceptron, Neural Networks, Python, OOP, Keras, TensorFlow, Custom Implementation]
---

## Project Overview

This project explores the construction and training of multi-layer perceptrons (MLP) from scratch in Python, highlighting a hands-on approach to deep learning model architecture, interpretability, and extension. Unlike typical projects that depend entirely on frameworks like TensorFlow or PyTorch, this work implements essential deep learning logic using class-based architecture and low-level Python constructs, which ensures transparent model behavior and full control over each component.

## Methodology

### Key Steps and Innovations

- **Manual Neural Network Construction**:  
  Developed all layers, activation functions (ReLU, sigmoid, etc.), and loss calculations from first principles using Python classes, without abstracting away complexity via Keras/PyTorch modules.
- **Stepwise Implementation**:  
  Built the network one step at a time, starting from forward propagation, loss calculation, and gradient computation to backpropagation and weight updates.
- **Custom Training Loop**:  
  Designed an end-to-end training routine to support batch processing, mini-batching, epoch control, and performance logging.
- **Interpretability Focus**:  
  Exposed intermediate gradients, activations, and weights for each epoch, supporting introspection and debugging.
- **Wide and Deep Integration**:  
  Explored “wide” feature concatenation with “deep” neural architectures to benchmark classic logistic regression versus deeper learned representations.

### Tools & Technologies

- **Languages:** Python
- **Libraries:** NumPy (core math operations); TensorFlow/Keras (for benchmarking against your implementation, not for core logic)
- **Architecture:** Custom OOP Python classes for all neural net elements

## Key Achievements

- **Full Transparency**:  
  Every step in the training and prediction pipeline is explicit, allowing for debugging, learning, and experimentation not possible with high-level APIs alone.
- **Educational Value**:  
  Provides a robust foundation for students and practitioners wanting to understand the mechanics of backpropagation, gradient descent, and the impact of architecture changes.
- **Performance Validation**:  
  Benchmarked custom model results against Keras/TensorFlow MLPs. Comparable accuracy achieved on structured data tasks and validating the correctness of a custom implementation.
- **Extensibility**:  
  Codebase is **modular**; future architectures (e.g., convolutional layers, custom activations) can be integrated without rewriting the core logic.

## Example Results

- Custom MLP achieved competitive accuracy and loss performance on tabular datasets, matching high-level frameworks within a reasonable margin.
- Demonstrated clear learning curves, reproducible results, and interpretable gradient flows.
- Wide-and-deep hybridization led to measurable improvements over single-path (wide or deep alone) models for specific tasks.

## GitHub Repository

- [Full code, notebooks, and documentation](https://github.com/schwill2018/Wide-and-Deep-Learning-with-Tensorflow-Keras)

## Conclusion & Future Work

Constructing neural networks from the ground up deepens understanding of model mechanics, gradient flow, and optimization, which is insight rarely gained from high-level libraries alone. This project’s hands-on approach creates a strong base for exploring more complex architectures, experimenting with new modeling ideas, and building transparent, reproducible analytics for both practical and educational settings.
