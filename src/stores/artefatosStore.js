import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useArtefatosStore = defineStore('artefatos', () => {
  const artefatos = ref([
        {
            "id": 10,
            "name": "Crânio",
            "raw_material": {
                "id": 1,
                "name": "Animal"
            },
            "sub_type": {
                "id": 1,
                "name": "Osso",
                "raw_material": 1
            },
            "images": [
                {
                    "public_id_cloudinary": "hfnzhg9j4o7fr8yvlm28",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763761809/hfnzhg9j4o7fr8yvlm28.jpg",
                    "artefact": 10
                },
                {
                    "public_id_cloudinary": "nucjwunavokh6ba1euzt",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763761811/nucjwunavokh6ba1euzt.jpg",
                    "artefact": 10
                }
            ]
        },
        {
            "id": 7,
            "name": "Crânio",
            "raw_material": {
                "id": 1,
                "name": "Animal"
            },
            "sub_type": {
                "id": 1,
                "name": "Osso",
                "raw_material": 1
            },
            "images": [
                {
                    "public_id_cloudinary": "wfrifshxdvvxk44tu4il",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756788/wfrifshxdvvxk44tu4il.jpg",
                    "artefact": 7
                },
                {
                    "public_id_cloudinary": "jwpplkjmahfkzdfycsce",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756789/jwpplkjmahfkzdfycsce.jpg",
                    "artefact": 7
                }
            ]
        },
        {
            "id": 7,
            "name": "Crânio",
            "raw_material": {
                "id": 1,
                "name": "Animal"
            },
            "sub_type": {
                "id": 1,
                "name": "Osso",
                "raw_material": 1
            },
            "images": [
                {
                    "public_id_cloudinary": "wfrifshxdvvxk44tu4il",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756788/wfrifshxdvvxk44tu4il.jpg",
                    "artefact": 7
                },
                {
                    "public_id_cloudinary": "jwpplkjmahfkzdfycsce",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756789/jwpplkjmahfkzdfycsce.jpg",
                    "artefact": 7
                }
            ]
        },
        {
            "id": 7,
            "name": "Crânio",
            "raw_material": {
                "id": 1,
                "name": "Animal"
            },
            "sub_type": {
                "id": 1,
                "name": "Osso",
                "raw_material": 1
            },
            "images": [
                {
                    "public_id_cloudinary": "wfrifshxdvvxk44tu4il",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756788/wfrifshxdvvxk44tu4il.jpg",
                    "artefact": 7
                },
                {
                    "public_id_cloudinary": "jwpplkjmahfkzdfycsce",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756789/jwpplkjmahfkzdfycsce.jpg",
                    "artefact": 7
                }
            ]
        },
        {
            "id": 7,
            "name": "Crânio",
            "raw_material": {
                "id": 1,
                "name": "Animal"
            },
            "sub_type": {
                "id": 1,
                "name": "Osso",
                "raw_material": 1
            },
            "images": [
                {
                    "public_id_cloudinary": "wfrifshxdvvxk44tu4il",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756788/wfrifshxdvvxk44tu4il.jpg",
                    "artefact": 7
                },
                {
                    "public_id_cloudinary": "jwpplkjmahfkzdfycsce",
                    "url_photo": "https://res.cloudinary.com/dcaxknnbq/image/upload/v1763756789/jwpplkjmahfkzdfycsce.jpg",
                    "artefact": 7
                }
            ]
        }
    ])

  return { artefatos }
})
