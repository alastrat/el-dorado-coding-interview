FROM node:20

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
RUN echo "node ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/node

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

WORKDIR /workspaces

# Install global npm packages
RUN npm install -g typescript ts-node nodemon

USER node

# Expose port 3000 for the application
#EXPOSE 3000