package com.parseq

import com.parseq.model.ErrorResponse
import com.parseq.service.VariantService
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import java.io.File

fun main() {
    embeddedServer(Netty, port = 10300) {
        module()
    }.start(wait = true)
}

fun Application.module() {
    val dataFile = File("data/clinvar.vcf.gz")
    val variantService = VariantService(dataFile)

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }

    routing {
        get("/api/variants") {
            call.response.headers.append("Access-Control-Allow-Origin", "http://localhost:10100")

            try {
                val rac = call.request.queryParameters["rac"]
                val lap = call.request.queryParameters["lap"]?.toLongOrNull()
                val rap = call.request.queryParameters["rap"]?.toLongOrNull()
                val refKey = call.request.queryParameters["refKey"]

                if (rac == null || lap == null || rap == null || refKey == null) {
                    call.respond(
                        HttpStatusCode.BadRequest,
                        ErrorResponse("BAD_REQUEST", "Missing or invalid query parameters")
                    )
                    return@get
                }

                val variant = variantService.findVariant(rac, lap, rap, refKey)
                if (variant != null) {
                    call.respond(variant)
                } else {
                    call.respond(
                        HttpStatusCode.NotFound,
                        ErrorResponse("NOT_FOUND", "Variant not found")
                    )
                }
            } catch (e: Exception) {
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponse("ERROR", e.message ?: "Unknown error occurred")
                )
            }
        }
    }
}