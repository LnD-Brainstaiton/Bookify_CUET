import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart, increaseQuantity, decreaseQuantity, addToCart } from '../../redux/features/cart/cartSlice';

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();

    const [selectedQuantity, setSelectedQuantity] = useState(1); // For Swal modal quantity

    // Calculate total price and ensure two decimal places
    const totalPrice = cartItems
        .reduce((acc, item) => acc + item.newPrice * item.quantity, 0)
        .toFixed(2);

    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleIncreaseQuantity = (product) => {
        dispatch(increaseQuantity(product));
    };

    const handleDecreaseQuantity = (product) => {
        if (product.quantity > 1) {
            dispatch(decreaseQuantity(product));
        }
    };

    const handleAddToCart = (product) => {
        Swal.fire({
            title: "Set Quantity",
            html: `
                <div class="flex justify-center items-center">
                    <button id="decreaseBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">-</button>
                    <span id="quantity" class="mx-4 text-xl">${selectedQuantity}</span>
                    <button id="increaseBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">+</button>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Add to Cart",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const quantity = parseInt(document.getElementById("quantity").innerText, 10);
                return quantity;
            },
            didOpen: () => {
                let quantity = selectedQuantity;

                document.getElementById("decreaseBtn").addEventListener("click", () => {
                    if (quantity > 1) {
                        quantity--;
                        document.getElementById("quantity").innerText = quantity;
                        setSelectedQuantity(quantity);
                    }
                });

                document.getElementById("increaseBtn").addEventListener("click", () => {
                    quantity++;
                    document.getElementById("quantity").innerText = quantity;
                    setSelectedQuantity(quantity);
                });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const quantity = result.value || 1;
                dispatch(addToCart({ ...product, quantity }));
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product Added to the Cart",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    return (
        <div className="flex mt-12 h-full flex-col overflow-hidden bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                    <div className="text-lg font-medium text-gray-900">Shopping Cart</div>
                    {cartItems.length > 0 && (
                        <div className="ml-3 flex h-7 items-center">
                            <button
                                type="button"
                                onClick={handleClearCart}
                                className="relative -m-2 py-1 px-2 bg-red-500 text-white rounded-md hover:bg-secondary transition-all duration-200"
                            >
                                <span>Clear Cart</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <div className="flow-root">
                        {cartItems.length > 0 ? (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {cartItems.map((product) => (
                                    <li key={product._id} className="flex py-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                alt="Product"
                                                src={getImgUrl(product?.coverImage)}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex flex-wrap justify-between text-base font-medium text-gray-900">
                                                    <h3>
                                                        <Link to={`/books/${product?._id}`}>{product?.title}</Link>
                                                    </h3>
                                                    <p className="sm:ml-4">
                                                        ${(product?.newPrice * product?.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 capitalize">
                                                    <strong>Category: </strong>
                                                    {product?.category}
                                                </p>
                                            </div>
                                            <div className="flex flex-1 flex-wrap items-end justify-between space-y-2 text-sm">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleDecreaseQuantity(product)}
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2">{product?.quantity}</span>
                                                    <button
                                                        onClick={() => handleIncreaseQuantity(product)}
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="flex">
                                                    <button
                                                        onClick={() => handleRemoveFromCart(product)}
                                                        type="button"
                                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">Your cart is empty!</p>
                        )}
                    </div>
                </div>
            </div>

            {cartItems.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${totalPrice}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/checkout"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                            Checkout
                        </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <Link to="/">
                            or
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
                            >
                                Continue shopping
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
