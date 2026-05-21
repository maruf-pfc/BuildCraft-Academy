# Stage 1: Dependency Installation & Application Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package descriptors
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Set default env or let it be passed at build-time
ARG NEXT_PUBLIC_API_URL=http://localhost:5237/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js production bundle
RUN npm run build

# Stage 2: Runtime Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Copy necessary production artifacts from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose HTTP port
EXPOSE 3000

CMD ["npm", "start"]
