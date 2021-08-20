ADMIN:::::::::::::::::::::

Register Admin:
route - /admin/register
method - POST
fields - phoneno, password

Login Admin:
route - /admin/login
method - POST
fields - phoneno, password

Let admin Created a new Catalogue:
route - /admin/createCatalogue
method - POST
fields - category, name, address, quantity


CUSTOMER:::::::::::::::::::::

Register CUSTOMER:
route - /customer/register
method - POST
fields - phoneno, password

Login CUSTOMER:
route - /customer/login
method - POST
fields - phoneno, password

Login CUSTOMER:
route - /customer/login
method - POST
fields - phoneno, password

Let Customer see Catalogues:
route - /customer/allCatalogues
method - GET

Let Customer a item to there Cart:
route - /customer/addTocart
method - POST
filed - catalogueId (copy From any catalogue from above route), Add one id at a time and same id in cart, it will give message of already in the Cart


Let Cutomer Place an Order:
route - /customer/makeOrder
method - POST
field - name, quantity, deliveryPoint, mobile (it will itself take the catalogue from your cart)




DELIVERY PARTNER:::::::::::::::::::::

Register DELIVERY PARTNER:
route - /agent/register
method - POST
fields - phoneno, password

Login DELIVERY PARTNER:
route - /agent/login
method - POST
fields - phoneno, password


route: /agent
access: only logged DELIVERY PARTNER
To access /admin : Please login to agent using /agent/login and copy the token and paste in headers like this: 
auth-token: copied token value form login agent route
