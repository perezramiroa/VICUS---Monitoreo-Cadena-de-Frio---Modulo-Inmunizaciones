/**
 * CONFIGURACIÓN CENTRALIZADA DE SENSORES - VICUS INMUNIZACIÓN
 */

const CONFIG_INMUNO = {
    // Definición de canales con sus respectivos IDs de carpeta en Drive
    canales: {
        "Hosp_Vacunatorio_1": { 
            id: 2986932, key: "9ODQC0Q4Y05C1O1T", 
            folderId_Tecnico: "1XxskFD2ntLT2EOUVigPZMw0L90pbXeDi",
            folderId_Semanal: "1uUpvDEFGuzS0Izwh8UXmZc0FEe-KxJdQ",
            folderId_Calculo: "1Q8yuiISB-Kp7JaHWpcSLOkheuVQ0KeGW",
            folderId_Desvio: "1noWUOOfHfDz4NVbGZNUFe9LJkA_UGFdx"
        },
        "Hosp_Vacunatorio_2": { 
            id: 2986935, key: "Q1CXSNKL68D24MJH", 
            folderId_Tecnico: "1XxskFD2ntLT2EOUVigPZMw0L90pbXeDi",
            folderId_Semanal: "1uUpvDEFGuzS0Izwh8UXmZc0FEe-KxJdQ",
            folderId_Calculo: "1Q8yuiISB-Kp7JaHWpcSLOkheuVQ0KeGW",
            folderId_Desvio: "1noWUOOfHfDz4NVbGZNUFe9LJkA_UGFdx"
        },
        "Depo_Vacunatorio_1": { 
            id: 2993812, key: "PNS5MD5VS74CKIIM", 
            folderId_Tecnico: "1XxskFD2ntLT2EOUVigPZMw0L90pbXeDi",
            folderId_Semanal: "1uUpvDEFGuzS0Izwh8UXmZc0FEe-KxJdQ",
            folderId_Calculo: "1Q8yuiISB-Kp7JaHWpcSLOkheuVQ0KeGW",
            folderId_Desvio: "1noWUOOfHfDz4NVbGZNUFe9LJkA_UGFdx"
        },
        "Depo_Vacunatorio_2": { 
            id: 2993815, key: "XZ0DG337HFATUG1O", isFreezer: true, fieldFreezer: "field2", 
            folderId_Tecnico: "1XxskFD2ntLT2EOUVigPZMw0L90pbXeDi",
            folderId_Semanal: "1uUpvDEFGuzS0Izwh8UXmZc0FEe-KxJdQ",
            folderId_Calculo: "1Q8yuiISB-Kp7JaHWpcSLOkheuVQ0KeGW",
            folderId_Desvio: "1noWUOOfHfDz4NVbGZNUFe9LJkA_UGFdx"
        },
        "Sarmiento_1": { 
            id: 3003527, key: "9ALDC8QUP8JV6ZDJ", 
            folderId_Tecnico: "1VyjSpe-X_T2fD8fGhvm6XRLUDS5mND0s",
            folderId_Semanal: "19k3VD_jSggds4Iy7RmDUqjYWTp2xdeC8",
            folderId_Calculo: "1bXawdoEq0EwvjMZJri2X5dNXmcVVZyyh",
            folderId_Desvio: "1r4H5cz9N3Kn80_OMueEwy3NPxq-DuJxP"
        },
        "Sarmiento_2": { 
            id: 3102139, key: "YPWRU12M4LY6DBIX", 
            folderId_Tecnico: "1jaCCybkIJQ4Xy5rSXvVnSoL9f0tI9IXH",
            folderId_Semanal: "1nPMnNzWnmL3YVfHrp5PFrCOXu4PLmBmU",
            folderId_Calculo: "1BW7G9IbehJtTAOzNW-R8hQ_f4AChM397",
            folderId_Desvio: "1o9LBBg9yyNe3Y48SAATvSHGZ8kHjltOI"
        },
        "Villa_Obrera": { 
            id: 3015641, key: "4IV9V3L1RC08AAQ5", 
            folderId_Tecnico: "1CTKmgLvV5SL8KLRz4s3a6hmvMkwELTmq",
            folderId_Semanal: "1wLBwGdsTnDMC4ugW-kYhifGuC5vAw8lI",
            folderId_Calculo: "18D1-RzkXvTNvHvyJ_3jah4Y1gcRQontn",
            folderId_Desvio: "194gfes6URjTN3pVhmIXE5Be4Hnrs4_Dr"
        },
        "Nueva_Espana": { 
            id: 3018408, key: "ZY1L55G8AUXGCV9B", 
            folderId_Tecnico: "1n9p50J76xx4WWUSqDQYK6iBl8Z2RdN7i",
            folderId_Semanal: "1l2G_9EyT0VPAeEw6Ep8yt6RTleUzEBmS",
            folderId_Calculo: "1NKSUo7tYd1T2Hz5UVz4YaNlEPJcLOfUu",
            folderId_Desvio: "1DE8rZA6a-adfrU_PbB9nsnSRmz7A4UnK"
        },
        "Once_Octubre": { 
            id: 3019919, key: "BGIYFCS3AS3BBQC0", 
            folderId_Tecnico: "1-jS7WJcef_UFzXEBOMqe6nA_nrg2yG5I",
            folderId_Semanal: "1rchCT8gT4naLEzz42VBGOBo7bzvDBPS0",
            folderId_Calculo: "1R1STBbXgvJCPB8Fg2pkLRxwKhdTSvW5A",
            folderId_Desvio: "1tX9iEZ1F5a6a0iHfuk8gEMSzw4tK_1BN"
        },
        "VAN": { 
            id: 3060520, key: "YBS2XVLA80RQ63J6", 
            folderId_Tecnico: "1DLN-1zdRObFRI6KchEw_1ZRMOSah5wL6",
            folderId_Semanal: "1WqO7ap0kwLpae77OmiH1X14YwWgpJc6x",
            folderId_Calculo: "1No32ZBBW7hUUyqYMT6nzp2oWpHggqjde",
            folderId_Desvio: "1M2ciXfvMox1Ga3K8hZ3QDVXjhzSu_4rh"
        },
        "VAS": { 
            id: 3079464, key: "18OTBS7ODP225VBW", 
            folderId_Tecnico: "1rGl_4Ok22VwmjxwyPFH0EroBEMjuk5rP",
            folderId_Semanal: "1cAd9zTGxNQvuTUyqOPpMIi9fv_b03lxz",
            folderId_Calculo: "1i2v2kmW0eOM0_NyyJaC95Y6KDFBF6Qur",
            folderId_Desvio: "17qi7Rm4TXjFhC6rBV2lZXIXwazQA5imt"
        },
        "Costa_Reyes": { 
            id: 3090672, key: "7K994UH4606YRUE1", 
            folderId_Tecnico: "1ak_7jReVdrz5SOTnuF7yF25cVf1nmUju",
            folderId_Semanal: "1qSRnCLK4scEiRc4viL2qpRP2E7UaVDF5",
            folderId_Calculo: "1k51QYualYpOmnIvNfImsReo2iX6XMLyA",
            folderId_Desvio: "1pwYUnnVT9ziqFXrw32sX_E2zxB-WjAj3"
        },
        "Hosp_Chanar_1": { 
            id: 3082646, key: "TSE6UAW72LLR8R39", 
            folderId_Tecnico: "1TcoL9Y6zUVoHDbzxf54yvUSRbBaLLtKz",
            folderId_Semanal: "1XjxfSXiYf9EM0-EYeNOkf_OKwKzOAnP9",
            folderId_Calculo: "1YpdJAXtIiRmbB6PS3KGZ37gAaJTLHPXk",
            folderId_Desvio: "1a5VS4sQ6oLGhK1MHV4hr5Wn54Jiqoy4p"
        },
        "Hosp_Chanar_2": { 
            id: 3125888, key: "SCAORB4D3OCPE9DK", 
            folderId_Tecnico: "1TcoL9Y6zUVoHDbzxf54yvUSRbBaLLtKz",
            folderId_Semanal: "1XjxfSXiYf9EM0-EYeNOkf_OKwKzOAnP9",
            folderId_Calculo: "1YpdJAXtIiRmbB6PS3KGZ37gAaJTLHPXk",
            folderId_Desvio: "1a5VS4sQ6oLGhK1MHV4hr5Wn54Jiqoy4p"
        },
        "Zona1_1": { 
            id: 3016635, key: "8QKPERAJWIATGC5F", 
            folderId_Tecnico: "1_MGzVzijxIZQz90LuBep7I57SmNfa4r8",
            folderId_Semanal: "1A4qfHVAcI11QCs5l6yqeW2q-VZlnH0Ht",
            folderId_Calculo: "18NxXqHvx4NXoZOmej4HpXoQNlY47gzUX",
            folderId_Desvio: "1fFOI0wpgKVy-qOMQaklu_-wEr8prM34G"
        },
        "Zona1_2": { 
            id: 3016636, key: "SAP43F3FB83V79KP", 
            folderId_Tecnico: "1_MGzVzijxIZQz90LuBep7I57SmNfa4r8",
            folderId_Semanal: "1A4qfHVAcI11QCs5l6yqeW2q-VZlnH0Ht",
            folderId_Calculo: "18NxXqHvx4NXoZOmej4HpXoQNlY47gzUX",
            folderId_Desvio: "1fFOI0wpgKVy-qOMQaklu_-wEr8prM34G"
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
