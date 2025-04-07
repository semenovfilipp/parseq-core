package com.parseq.model

import kotlinx.serialization.Serializable

@Serializable
data class GeneticVariant(
    val rac: String,
    val lap: Long,
    val rap: Long,
    val refKey: String,
    val vcfId: String? = null,
    val clnSig: String? = null,
    val clnRevStat: String? = null,
    val clnVc: String? = null
)

@Serializable
data class ErrorResponse(
    val error: String,
    val message: String
)