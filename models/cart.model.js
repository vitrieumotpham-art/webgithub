const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            default: ""
        },
        // Đổi tên từ 'duan' thành 'products' để khớp với các hàm update trước đó
        products: [ 
            {
                product_id: {
                    type: String,
                    ref: "duan" // Quan trọng: Phải khớp với tên Model dự án của bạn
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;