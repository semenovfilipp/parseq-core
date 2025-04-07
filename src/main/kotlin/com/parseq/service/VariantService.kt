package com.parseq.service

import com.parseq.WithLogger
import com.parseq.model.GeneticVariant
import htsjdk.tribble.readers.TabixReader
import java.io.File

class VariantService(private val dataFile: File) : WithLogger {

    fun findVariant(rac: String, lap: Long, rap: Long, refKey: String): GeneticVariant? {
        log.info("Searching for variant: rac=$rac, lap=$lap, rap=$rap, refKey=$refKey")
        log.info("Using datafile: ${dataFile.absolutePath}")

        if (!isFileValid(dataFile)) return null

        val indexFile = File("${dataFile.absolutePath}.tbi")
        if (!isFileValid(indexFile)) return null

        return findVariantInTabix(rac, lap, rap, refKey)
    }

    private fun isFileValid(file: File): Boolean {
        if (!file.exists()) {
            log.error("File does not exist: ${file.absolutePath}")
            return false
        }
        return true
    }

    private fun findVariantInTabix(rac: String, lap: Long, rap: Long, refKey: String): GeneticVariant? {
        val tabixReader = TabixReader(dataFile.absolutePath)
        try {
            val queryStr = buildQueryString(rac, lap, rap)
            log.info("Query string: $queryStr")

            val iterator = tabixReader.query(queryStr)
            log.info("Tabix iterator created")

            return searchVariant(iterator, refKey)
        } catch (e: Exception) {
            log.error("Error while searching for variant", e)
            throw e
        } finally {
            tabixReader.close()
        }
    }

    private fun buildQueryString(rac: String, lap: Long, rap: Long): String {
        val chr = formatChromosome(rac)
        return "$chr:${lap}-${rap}"
    }

    private fun formatChromosome(rac: String): String {
        return rac.replace("NC_0000", "")
            .replace(".11", "")
            .replace(".10", "")
            .replace("^0+".toRegex(), "")
    }

    private fun searchVariant(iterator: TabixReader.Iterator, refKey: String): GeneticVariant? {
        var record = iterator.next()
        log.info("First record: $record")

        while (record != null) {
            log.debug("Found record: $record")
            val fields = record.split("\t")
            log.debug("Fields: ${fields.joinToString(",")}")

            if (fields.size >= 8 && isMatchingVariant(fields, refKey)) {
                log.info("Found matching variant: $record")
                return createGeneticVariant(fields)
            }

            record = iterator.next()
        }
        log.info("No matching variant found")
        return null
    }

    private fun isMatchingVariant(fields: List<String>, refKey: String): Boolean {
        val vcfRef = fields[3]
        val vcfAlt = fields[4]
        log.debug("Comparing refKey=$refKey with vcfRef=$vcfRef and vcfAlt=$vcfAlt")
        return refKey == vcfRef || refKey == vcfAlt
    }

    private fun createGeneticVariant(fields: List<String>): GeneticVariant {
        return GeneticVariant(
            rac = fields[0],
            lap = fields[1].toLong(),
            rap = fields[1].toLong(),
            refKey = fields[3],
            vcfId = fields[2],
            clnSig = extractFieldValue(fields[7], "CLNSIG"),
            clnRevStat = extractFieldValue(fields[7], "CLNREVSTAT"),
            clnVc = extractFieldValue(fields[7], "CLNVC")
        )
    }

    private fun extractFieldValue(field: String, prefix: String): String? {
        return field.split(";").find { it.startsWith("$prefix=") }?.substringAfter("=")
    }
}