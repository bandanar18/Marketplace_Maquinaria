UPDATE "Product" SET status = 'ACTIVE' WHERE status IN ('PENDING_REVIEW', 'DRAFT', 'PAUSED');
