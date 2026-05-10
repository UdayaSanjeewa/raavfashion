/*
  # Fix generate_order_number race condition

  The previous function had a race condition where two concurrent requests could
  read the same max order number and both try to insert the same order number,
  causing a unique constraint violation.

  Fix: Use pg_advisory_xact_lock to serialize access to the counter, then
  re-read the max inside the lock so only one caller increments at a time.
*/

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_order_number text;
  max_order_number text;
  order_count integer;
  today_prefix text;
BEGIN
  -- Serialize all calls to this function with an advisory lock
  PERFORM pg_advisory_xact_lock(hashtext('generate_order_number'));

  today_prefix := 'ORD-' || TO_CHAR(NOW() AT TIME ZONE 'UTC', 'YYYYMMDD');

  -- Read the highest existing order number for today INSIDE the lock
  SELECT order_number INTO max_order_number
  FROM orders
  WHERE order_number LIKE today_prefix || '%'
  ORDER BY order_number DESC
  LIMIT 1;

  IF max_order_number IS NOT NULL THEN
    order_count := SUBSTRING(max_order_number FROM '[0-9]+$')::integer + 1;
  ELSE
    order_count := 1;
  END IF;

  new_order_number := today_prefix || '-' || LPAD(order_count::text, 5, '0');

  -- Safety loop in case somehow still a collision (should never happen with the lock)
  WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) LOOP
    order_count := order_count + 1;
    new_order_number := today_prefix || '-' || LPAD(order_count::text, 5, '0');
  END LOOP;

  RETURN new_order_number;
END;
$$;
