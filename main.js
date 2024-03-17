// Initialize products array
var products = [];

// Function to retrieve products from Local Storage
function retrieveProductsFromLocalStorage() {
    var storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        try {
            return JSON.parse(storedProducts);
        } catch (error) {
            console.error('Error parsing stored products:', error);
            return [];
        }
    }
    return [];
}

// Initialize products on page load
document.addEventListener("DOMContentLoaded", function() {
    products = retrieveProductsFromLocalStorage();
    updateSearchFunctionality();
    document.getElementById("productForm").addEventListener("submit", handleFormSubmission);
    
    // Add event listeners to buttons
    document.getElementById("btnTeaSet").addEventListener("click", function() {
        showProductsByType("თეფში");
    });
    document.getElementById("btnPlate").addEventListener("click", function() {
        showProductsByType("ჭიქა");
    });
    document.getElementById("btnCup").addEventListener("click", function() {
        showProductsByType("დოქი");
    });
    document.getElementById("btnOther").addEventListener("click", function() {
        showProductsByType("სხვა");
    });
});

// Function to save products to Local Storage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Function to search for a product by code
function searchProduct(code) {
    return products.find(product => product.code === code) || null;
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();

    // Get form values
    var productName = document.getElementById("productName").value;
    var productCode = document.getElementById("productCode").value;
    var productType = document.getElementById("productType").value;
    var productMaterial = document.getElementById("productMaterial").value;
    var productDescription = document.getElementById("productDescription").value;
    var productPrice = document.getElementById("productPrice").value;
    var productImage = document.getElementById("productImage").files[0];
    
    // Validate price
    if (productPrice === "" || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
        document.getElementById("priceErrorMessage").textContent = "გთხოვთ შეიყვანოთ სწორი ფასი";
        return;
    } else {
        document.getElementById("priceErrorMessage").textContent = "";
    }

    // Parse product price as a float
    var parsedPrice = parseFloat(productPrice);

    // Check if the parsed price is a valid number
    if (!isNaN(parsedPrice) && parsedPrice > 0) {
        // Format the price with two decimal places
        productPrice = parsedPrice.toFixed(2) + " ლარი";
    } else {
        document.getElementById("priceErrorMessage").textContent = "გთხოვთ შეიყვანოთ სწორი ფასი";
        return;
    }

    // Check if product with the same code already exists
    var existingProductIndex = products.findIndex(product => product.code === productCode);
    if (existingProductIndex !== -1) {
        // Edit existing product
        // Code for editing the product...
    } else {
        // Add new product
        var product = {
            name: productName,
            code: productCode,
            type: productType,
            material: productMaterial,
            description: productDescription,
            price: productPrice,
            image: productImage ? productImage.name : ""
        };
        products.push(product);

        // Save products to Local Storage
        saveProducts();

        // Display success message
        alert("Product added successfully!");

        // Append "ლარი" to the price in the form
        document.getElementById("productPrice").value = productPrice;

        // Reset form
        document.getElementById("productForm").reset();
        
        // Update search functionality
        updateSearchFunctionality();
    }
}

// Function to update search functionality
function updateSearchFunctionality() {
    var searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function(event) {
        var searchValue = event.target.value.trim();
        if (searchValue.length > 0) {
            var product = searchProduct(searchValue);
            displayProduct(product);
        } else {
            document.getElementById("productInfo").innerHTML = "";
        }
    });
}

// Function to display product information below the product code input field
function displayProduct(product) {
    var productInfoDiv = document.getElementById("productInfo");
    if (product) {
        var productCodeInput = document.getElementById("productCode");
        var productInfoContainer = document.createElement('div');
        productInfoContainer.classList.add('product-info-container');
        productInfoContainer.innerHTML = `
            <h2>${product.name}</h2>
            <p><strong>Product Code:</strong> ${product.code}</p>
            <p><strong>Type:</strong> ${product.type}</p>
            <p><strong>Material:</strong> ${product.material}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> ${product.price} ლარი</p>
            <img src="${product.image}" alt="${product.name}">
        `;
        productInfoDiv.insertBefore(productInfoContainer, productCodeInput.nextSibling);
    } else {
        productInfoDiv.innerHTML = "Product not found.";
    }
}

// Function to show products of a specific type
function showProductsByType(productType) {
    var productSection = document.getElementById("productInfo");
    productSection.innerHTML = '';
    products.forEach(function(product) {
        if (product.type === productType) {
            var productDiv = document.createElement('div');
            productDiv.classList.add('product-frame'); // Add a CSS class for styling
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p><strong>პროდუქტის კოდი:</strong> ${product.code}</p>
                <p><strong>მასალა:</strong> ${product.material}</p>
                <p><strong>აღწერა:</strong> ${product.description}</p>
                <p><strong>ფასი:</strong> ${product.price}</p>
            `;
            productSection.appendChild(productDiv);
        }
    });
}

// Function to show products of a specific type in a new window
function showProductsByTypeInNewWindow(productType) {
    var newWindow = window.open('', '_blank');
    newWindow.document.write('<html><head><title>Products</title></head><body>');

    products.forEach(function(product) {
        if (product.type === productType) {
            newWindow.document.write(`
                <div>
                    <h3>${product.name}</h3>
                    <p><strong>პროდუქტის კოდი:</strong> ${product.code}</p>
                    <p><strong>მასალა:</strong> ${product.material}</p>
                    <p><strong>აღწერა:</strong> ${product.description}</p>
                    <p><strong>ფასი:</strong> ${product.price}</p>
                </div>
            `);
        }
    });

    newWindow.document.write('</body></html>');
    newWindow.document.close();
}

document.getElementById("btnTeaSet").addEventListener("click", function() {
    showProductsByType("თეფში");
});

document.getElementById("btnPlate").addEventListener("click", function() {
    showProductsByType("ჭიქა");
});

document.getElementById("btnCup").addEventListener("click", function() {
    showProductsByType("დოქი");
});

document.getElementById("btnOther").addEventListener("click", function() {
    showProductsByType("სხვა");
});
