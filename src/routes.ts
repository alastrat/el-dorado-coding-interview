import { Server } from "@hapi/hapi"
import Joi from "@hapi/joi"

interface Item {
    id: number
    name: string
    price: number
}

let items: Item[] = []
let nextId = 1

export const defineRoutes = (server: Server) => {
    // Health check route
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async (request, h) => {
            return { ok: true }
        }
    })

    // Get all items
    server.route({
        method: 'GET',
        path: '/items',
        handler: async (request, h) => {
            return items
        }
    })

    // Get item by id
    server.route({
        method: 'GET',
        path: '/items/{id}',
        handler: async (request, h) => {
            const item = items.find(i => i.id === parseInt(request.params.id))
            if (!item) {
                return h.response().code(404)
            }
            return item
        }
    })

    // Create new item
    server.route({
        method: 'POST',
        path: '/items',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().required().min(0).messages({
                        'number.min': 'Field "price" cannot be negative',
                        'any.required': 'Field "price" is required'
                    })
                }) as any,
                failAction: (request, h, err: any) => {
                    const error = err.details[0]
                    return h.response({
                        errors: [{
                            field: error.path[0],
                            message: error.message
                        }]
                    }).code(400).takeover()
                }
            }
        },
        handler: async (request, h) => {
            const payload = request.payload as Omit<Item, 'id'>
            const newItem: Item = {
                id: nextId++,
                ...payload
            }
            items.push(newItem)
            return h.response(newItem).code(201)
        }
    })

    // Update item
    server.route({
        method: 'PUT',
        path: '/items/{id}',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    price: Joi.number().required().min(0).messages({
                        'number.min': 'Field "price" cannot be negative'
                    })
                }) as any,
                failAction: (request, h, err: any) => {
                    const error = err.details[0]
                    return h.response({
                        errors: [{
                            field: error.path[0],
                            message: error.message
                        }]
                    }).code(400).takeover()
                }
            }
        },
        handler: async (request, h) => {
            const id = parseInt(request.params.id)
            const itemIndex = items.findIndex(i => i.id === id)
            if (itemIndex === -1) {
                return h.response().code(404)
            }

            const payload = request.payload as Omit<Item, 'id'>
            const updatedItem: Item = {
                id,
                ...payload
            }
            items[itemIndex] = updatedItem
            return updatedItem
        }
    })

    // Delete item
    server.route({
        method: 'DELETE',
        path: '/items/{id}',
        handler: async (request, h) => {
            const id = parseInt(request.params.id)
            const itemIndex = items.findIndex(i => i.id === id)
            if (itemIndex === -1) {
                return h.response().code(404)
            }
            
            items.splice(itemIndex, 1)
            return h.response().code(204)
        }
    })  
}