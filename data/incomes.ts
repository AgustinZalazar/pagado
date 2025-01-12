import { Payment } from "@/types/payment";

export const IncomesData: Payment[] = [
    {
        "id": '1',
        "description": "Suscripción mensual",
        "type": "expense",
        "category": "Entretenimiento",
        "amount": 15.99,
        "date": "2024-12-01",
        "typeOfPayment": "Tarjeta de crédito"
    },
    {
        "id": '2',
        "description": "Pago por proyecto freelance",
        "type": "income",
        "category": "Trabajo",
        "amount": 250.00,
        "date": "2024-12-10",
        "typeOfPayment": "Transferencia bancaria"
    },
    {
        "id": '3',
        "description": "Compra de supermercado",
        "type": "expense",
        "category": "Alimentos",
        "amount": 123.45,
        "date": "2024-12-15",
        "typeOfPayment": "Tarjeta de débito"
    },
    {
        "id": '4',
        "description": "Pago de servicios públicos",
        "type": "expense",
        "category": "Servicios",
        "amount": 85.50,
        "date": "2024-11-30",
        "typeOfPayment": "Pago en línea"
    },
    {
        "id": '5',
        "description": "Bono del trabajo",
        "type": "income",
        "category": "Salario",
        "amount": 1200.00,
        "date": "2024-12-20",
        "typeOfPayment": "Depósito directo"
    }
]