/**
 * CONFIGURACIÓN CENTRALIZADA DE SENSORES - VICUS INMUNIZACIÓN
 */

const CONFIG_INMUNO = {
    // Definición de canales con sus respectivos IDs de carpeta en Drive
    canales: {
        "Hosp_Vacunatorio_1": { 
            id: 2986932, key: "9ODQC0Q4Y05C1O1T", 
            folderId_Tecnico: "1vvtsDsdD3xdqqwTe3_MFdutiRTGNonPg",
            folderId_Semanal: "1_6htpYwGwxNkUlZyuBNhyhKbXaNW5IPQ",
            folderId_Calculo: "1rxDKuG4knqS5cXSLadklfqFGWB4n3vX2",
            folderId_Desvio: "1q0Yrtzv6oSK6l-ykfuZ9ZksVJzwDeOBp"
        },
        "Hosp_Vacunatorio_2": { 
            id: 2986935, key: "Q1CXSNKL68D24MJH", 
            folderId_Tecnico: "1vvtsDsdD3xdqqwTe3_MFdutiRTGNonPg",
            folderId_Semanal: "1_6htpYwGwxNkUlZyuBNhyhKbXaNW5IPQ",
            folderId_Calculo: "1rxDKuG4knqS5cXSLadklfqFGWB4n3vX2",
            folderId_Desvio: "1q0Yrtzv6oSK6l-ykfuZ9ZksVJzwDeOBp"
        },
        "Depo_Vacunatorio_1": { 
            id: 2993812, key: "PNS5MD5VS74CKIIM", 
            folderId_Tecnico: "1vvtsDsdD3xdqqwTe3_MFdutiRTGNonPg",
            folderId_Semanal: "1_6htpYwGwxNkUlZyuBNhyhKbXaNW5IPQ",
            folderId_Calculo: "1rxDKuG4knqS5cXSLadklfqFGWB4n3vX2",
            folderId_Desvio: "1q0Yrtzv6oSK6l-ykfuZ9ZksVJzwDeOBp"
        },
        "Depo_Vacunatorio_2": { 
            id: 2993815, key: "XZ0DG337HFATUG1O", isFreezer: true, fieldFreezer: "field2", 
            folderId_Tecnico: "1vvtsDsdD3xdqqwTe3_MFdutiRTGNonPg",
            folderId_Semanal: "1_6htpYwGwxNkUlZyuBNhyhKbXaNW5IPQ",
            folderId_Calculo: "1rxDKuG4knqS5cXSLadklfqFGWB4n3vX2",
            folderId_Desvio: "1q0Yrtzv6oSK6l-ykfuZ9ZksVJzwDeOBp"
        },
        "Sarmiento_1": { 
            id: 3003527, key: "9ALDC8QUP8JV6ZDJ", 
            folderId_Tecnico: "1d9wiHgEoKs4OmgLi9dapvzHCZUUYj-l9",
            folderId_Semanal: "1N163HyXD8WCQef5FzANrDwNJ5ZOBfD3q",
            folderId_Calculo: "13fkDm_102G6IodfDK3PRTorrYQuqYgqA",
            folderId_Desvio: "15im-ylfLRY9wd8_mTpwNUC4FPwxSWGyf"
        },
        "Sarmiento_2": { 
            id: 3102139, key: "YPWRU12M4LY6DBIX", 
            folderId_Tecnico: "1pUwu374roF1-7QOHnt8saAvTD66_k4rv",
            folderId_Semanal: "14RSuSAXsOsYdFTlKMeHeP718h7n7glx9",
            folderId_Calculo: "1Z_Q4qsi9UitSgpwPjkn4ATQhmyvsyqe9",
            folderId_Desvio: "1gQjztb4YUrFqzLUlp_lkutX17NGvMwlk"
        },
        "Villa_Obrera": { 
            id: 3015641, key: "4IV9V3L1RC08AAQ5", 
            folderId_Tecnico: "1-DZsi7UkruU646KlIdfyz7bNt_KVs0V3",
            folderId_Semanal: "1pmmAczecphzLSqJ-Tz5aL0oJo5mjeTBt",
            folderId_Calculo: "1V9elGuGb09QQ7soIzR4CTMNMiBg9naRX",
            folderId_Desvio: "1mm7a6lz3LBF_CnEN9vNiMEIx3_uOL5Ii"
        },
        "Nueva_Espana": { 
            id: 3018408, key: "ZY1L55G8AUXGCV9B", 
            folderId_Tecnico: "1XI_QiSL7VXkI1PaZUM1P8F7iKrcCTNf0",
            folderId_Semanal: "1hawLuNoFj3ZMyuSRXxNkye1eruSxO8YI",
            folderId_Calculo: "12nVB4HtY56NBsXdipRMVB77H3fLJPmiq",
            folderId_Desvio: "1XbjIZ_BA9KWe20TdpxX3WMpJ5NsswxoQ"
        },
        "Once_Octubre": { 
            id: 3019919, key: "BGIYFCS3AS3BBQC0", 
            folderId_Tecnico: "1-Kb4PZ0atScebpspLL6Ia7c2Obu43XfS",
            folderId_Semanal: "16zXWFpfuToLd3R4UMJirI3fHM8WhAnkd",
            folderId_Calculo: "10A4D8mwNwFBJS_RqkxsIehDY9-vOB5XS",
            folderId_Desvio: "1cd-S5aoIij0Y74gWkZX5efRUu1SVRFVF"
        },
        "VAN": { 
            id: 3060520, key: "YBS2XVLA80RQ63J6", 
            folderId_Tecnico: "1iA6WlL387h9lH7LRHyG3KqEKyo1DUIz_",
            folderId_Semanal: "10dDvfWEYGC4A8tn-OXsHs6XPyQIvj4gy",
            folderId_Calculo: "1VG9Kd-LgF-w4-lAU91SJVDfu0mo50sJV",
            folderId_Desvio: "114Q_l-ul61MKeb58B65kN1vOdgDvo47t"
        },
        "VAS": { 
            id: 3079464, key: "18OTBS7ODP225VBW", 
            folderId_Tecnico: "1i7TfhLQCl93RXm75K6RzLu67o0fU_Ki6",
            folderId_Semanal: "14NejZ-PcK4NUhxUvpDsi9I08BbF94rJF",
            folderId_Calculo: "1nduAcMyFPJ7h7PUrDGeUu83aFzJhUAPe",
            folderId_Desvio: "1oDwYGACHJt_29IknBSDEGuAJOUJzLd_V"
        },
        "Costa_Reyes": { 
            id: 3090672, key: "7K994UH4606YRUE1", 
            folderId_Tecnico: "1O6vrCQW6pSMhW0yXb9K_phm2SKMyXFWA",
            folderId_Semanal: "1IDTZVB49ZTcNA7fhq7sQQuVCFjpWVAW-",
            folderId_Calculo: "1y0PqA6qtcXD0q4nhg-HBWK5S6EpeU1SM",
            folderId_Desvio: "1_yCz-MIXQt6FjBNux5l0jfLUMd-z2NQp"
        },
        "Hosp_Chanar_1": { 
            id: 3082646, key: "TSE6UAW72LLR8R39", 
            folderId_Tecnico: "1IdwQT3v1T-uHTa0Ni4MZHkWyVAgf8LzK",
            folderId_Semanal: "1x2CiZxrfv-iVdVBwAWWQ3vDjqhH9BRff",
            folderId_Calculo: "1tKC6qvZ7lMwtw3Uv7EoQRNwUaV0quA3N",
            folderId_Desvio: "1q8s4Wllzj4uz_0gf6mbDwPXoDP7cloef"
        },
        "Hosp_Chanar_2": { 
            id: 3125888, key: "SCAORB4D3OCPE9DK", 
            folderId_Tecnico: "1IdwQT3v1T-uHTa0Ni4MZHkWyVAgf8LzK",
            folderId_Semanal: "1x2CiZxrfv-iVdVBwAWWQ3vDjqhH9BRff",
            folderId_Calculo: "1tKC6qvZ7lMwtw3Uv7EoQRNwUaV0quA3N",
            folderId_Desvio: "1q8s4Wllzj4uz_0gf6mbDwPXoDP7cloef"
        },
        "Zona1_1": { 
            id: 3016635, key: "8QKPERAJWIATGC5F", 
            folderId_Tecnico: "1_3_S714T-PcwKOHeThZEukkPTUB-rRuS",
            folderId_Semanal: "1BEcVkfeGZeKFTvdrKv17tmeo7baGu11r",
            folderId_Calculo: "19DEi2CH2d1_PZ5VZQ1HNJEoBXnUWY3_4",
            folderId_Desvio: "1_DgTnjYqLgDfQorIinGimNYgmrS4_Peo"
        },
        "Zona1_2": { 
            id: 3016636, key: "SAP43F3FB83V79KP", 
            folderId_Tecnico: "1_3_S714T-PcwKOHeThZEukkPTUB-rRuS",
            folderId_Semanal: "1BEcVkfeGZeKFTvdrKv17tmeo7baGu11r",
            folderId_Calculo: "19DEi2CH2d1_PZ5VZQ1HNJEoBXnUWY3_4",
            folderId_Desvio: "1_DgTnjYqLgDfQorIinGimNYgmrS4_Peo"
        }
    },

    // Mapeo de Contraseñas -> Canales autorizados
    accesos: {
        "Zona uno": ["Zona1_1", "Zona1_2", "Hosp_Vacunatorio_1", "Hosp_Vacunatorio_2", "Depo_Vacunatorio_1", "Depo_Vacunatorio_2", "Sarmiento_1", "Sarmiento_2", "Villa_Obrera", "Nueva_Espana", "Once_Octubre", "VAN", "VAS", "Costa_Reyes", "Hosp_Chanar_1", "Hosp_Chanar_2"],
        "Hospital Chañar": ["Hosp_Chanar_1", "Hosp_Chanar_2"],
        "Hospital Centenario": ["Hosp_Vacunatorio_1", "Hosp_Vacunatorio_2", "Depo_Vacunatorio_1", "Depo_Vacunatorio_2"],
        "VAS": ["VAS"],
        "VAN": ["VAN"],
        "Costa de Reyes": ["Costa_Reyes"],
        "Sarmiento 1": ["Sarmiento_1"],
        "Sarmiento 2": ["Sarmiento_2"],
        "Villa Obrera": ["Villa_Obrera"],
        "11 de Octubre": ["Once_Octubre"],
        "Nueva España": ["Nueva_Espana"]
    }
};
