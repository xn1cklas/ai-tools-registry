const isProduction = process.env.NODE_ENV === "production"

export const featureFlags = {
  playgroundEnabled: !isProduction,
}
