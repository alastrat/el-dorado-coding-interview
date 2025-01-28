import { initializeServer, startServer } from "./server"

process.on('unhandledRejection', (err) => {
    console.error(err)
    process.exit(1)
})

async function main() {
    await startServer()
}

main().catch(err => {
    console.error('Failed to start server:', err)
    process.exit(1)
})