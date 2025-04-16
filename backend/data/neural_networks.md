# Neural Networks

## Definition
A neural network is a machine learning program, or model, that makes decisions in a manner similar to the human brain, by using processes that mimic the way biological neurons work together to identify phenomena, weigh options and arrive at conclusions.

## Structure
- **Input Layer**: Receives initial data
- **Hidden Layers**: One or more intermediate processing layers
- **Output Layer**: Produces the final result
- **Nodes/Neurons**: Each node connects to others and has its own associated weight and threshold
- **Activation**: If the output of any individual node is above the specified threshold value, that node is activated, sending data to the next layer

## How Neural Networks Work
- Each individual node functions like a linear regression model
- Components include input data, weights, bias (threshold), and output
- Formula: ∑wixi + bias = w1x1 + w2x2 + w3x3 + bias
- Output activation: f(x) = 1 if ∑w1x1 + b >= 0; 0 if ∑w1x1 + b < 0
- Weights determine the importance of variables, with larger weights contributing more significantly
- Inputs are multiplied by weights, summed, and passed through an activation function
- If output exceeds threshold, the node "fires" and passes data to the next layer
- This creates a feedforward network where data passes from input to output

## Training Process
- Neural networks rely on training data to learn and improve accuracy
- Training uses a cost (loss) function, often mean squared error (MSE)
- The goal is to minimize the cost function to ensure correctness
- Weights and biases are adjusted through gradient descent
- Backpropagation allows calculation of errors associated with each neuron

## Types of Neural Networks
- **Perceptron**: The oldest neural network (1958)
- **Feedforward Neural Networks/MLPs**: Basic structure with input, hidden, and output layers
- **Convolutional Neural Networks (CNNs)**: Used for image recognition and computer vision
- **Recurrent Neural Networks (RNNs)**: Handle sequential data with memory of previous inputs
- **Long Short-Term Memory Networks (LSTMs)**: Special RNNs that can learn long-term dependencies

## Applications
- Speech recognition
- Image recognition
- Natural language processing
- Decision-making systems
- Google's search algorithm is a well-known example

## Terminology
- **Artificial Neural Networks (ANNs)**: Another name for neural networks
- **Simulated Neural Networks (SNNs)**: Another name for neural networks
- **Deep Learning**: Neural networks with multiple hidden layers
- **Activation Function**: Determines if a neuron should be activated
- **Weights**: Parameters that determine the strength of connections between neurons
- **Bias**: Additional parameter that helps the model fit better to the data

## Importance
- Neural networks are powerful tools in computer science and artificial intelligence
- They can classify and cluster data at high velocity
- Tasks that would take hours for humans can be completed in minutes
- They form the foundation for many advanced AI applications

Source: IBM - https://www.ibm.com/think/topics/neural-networks
