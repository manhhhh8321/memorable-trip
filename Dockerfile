# Set the base image to use
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /

# Copy the package.json and yarn.lock files into the container
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile --production=true

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the application will run on
EXPOSE 3000

# Start the application with yarn
CMD ["yarn", "start"]
