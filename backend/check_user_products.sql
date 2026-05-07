SELECT u.email, u."companyId", c.name as company_name, p.title as product_title, p.status 
FROM "User" u
LEFT JOIN "Company" c ON u."companyId" = c.id
LEFT JOIN "Product" p ON p."companyId" = u."companyId"
WHERE u.email = 'empresa.demo@maquinaria.local';
