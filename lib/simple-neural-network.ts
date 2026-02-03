/**
 * Simple Neural Network implementation without external dependencies
 * Lightweight and browser-compatible
 */

export class SimpleNeuralNetwork {
  private weights: number[][][];
  private biases: number[][];
  private layers: number[];
  private learningRate: number;

  constructor(layers: number[], learningRate: number = 0.01) {
    this.layers = layers;
    this.learningRate = learningRate;
    this.weights = [];
    this.biases = [];
    
    // Initialize weights and biases
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];
      
      for (let j = 0; j < layers[i + 1]; j++) {
        const neuronWeights: number[] = [];
        for (let k = 0; k < layers[i]; k++) {
          neuronWeights.push(this.randomWeight());
        }
        layerWeights.push(neuronWeights);
        layerBiases.push(this.randomWeight());
      }
      
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }

  private randomWeight(): number {
    return Math.random() * 2 - 1; // Random between -1 and 1
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }

  private feedForward(input: number[]): number[][] {
    const activations: number[][] = [input];
    
    for (let i = 0; i < this.weights.length; i++) {
      const layerOutput: number[] = [];
      
      for (let j = 0; j < this.weights[i].length; j++) {
        let sum = this.biases[i][j];
        
        for (let k = 0; k < activations[i].length; k++) {
          sum += activations[i][k] * this.weights[i][j][k];
        }
        
        layerOutput.push(this.sigmoid(sum));
      }
      
      activations.push(layerOutput);
    }
    
    return activations;
  }

  predict(input: number[]): number[] {
    const activations = this.feedForward(input);
    return activations[activations.length - 1];
  }

  train(trainingData: { input: number[]; output: number[] }[], iterations: number, onProgress?: (progress: number) => void): void {
    for (let iter = 0; iter < iterations; iter++) {
      // Shuffle training data
      const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
      
      for (const data of shuffled) {
        this.backpropagate(data.input, data.output);
      }
      
      // Report progress
      if (onProgress && iter % 100 === 0) {
        const progress = (iter / iterations) * 100;
        onProgress(progress);
      }
    }
    
    if (onProgress) {
      onProgress(100);
    }
  }

  private backpropagate(input: number[], target: number[]): void {
    // Forward pass
    const activations = this.feedForward(input);
    
    // Calculate output layer error
    const errors: number[][] = [];
    const outputError: number[] = [];
    
    for (let i = 0; i < target.length; i++) {
      outputError.push(target[i] - activations[activations.length - 1][i]);
    }
    errors.push(outputError);
    
    // Backpropagate error
    for (let i = this.weights.length - 1; i > 0; i--) {
      const layerError: number[] = [];
      
      for (let j = 0; j < this.weights[i - 1].length; j++) {
        let error = 0;
        for (let k = 0; k < this.weights[i].length; k++) {
          error += errors[0][k] * this.weights[i][k][j];
        }
        layerError.push(error);
      }
      
      errors.unshift(layerError);
    }
    
    // Update weights and biases
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i].length; j++) {
        const delta = errors[i][j] * this.sigmoidDerivative(activations[i + 1][j]);
        
        for (let k = 0; k < this.weights[i][j].length; k++) {
          this.weights[i][j][k] += this.learningRate * delta * activations[i][k];
        }
        
        this.biases[i][j] += this.learningRate * delta;
      }
    }
  }

  toJSON(): any {
    return {
      layers: this.layers,
      weights: this.weights,
      biases: this.biases,
      learningRate: this.learningRate
    };
  }

  fromJSON(data: any): void {
    this.layers = data.layers;
    this.weights = data.weights;
    this.biases = data.biases;
    this.learningRate = data.learningRate;
  }
}
