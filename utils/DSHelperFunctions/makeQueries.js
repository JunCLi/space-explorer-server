module.exports.createSelectQuery = (selectColumns, table, selector, selectorValue) => {
  const queryString = selectColumns.join(', ')

  if (selector) {
    return {
      text: `SELECT ${queryString} FROM ${table} WHERE ${selector} = '${selectorValue}'`
    }
  } else {
    return {
      text: `SELECT ${queryString} FROM ${table}`
    }
  }
}

module.exports.createInsertQuery = (inputObject, table, returnValues) => {
	const camelToSnake = string => (
    string.replace(/([A-Z])/g, letter => (
        '_' + letter.toLowerCase()
    ))
	)

	const queryKeys = Object.keys(inputObject)
  const queryValues = Object.values(inputObject)
	const convertedQueryKeys = queryKeys.map(key => camelToSnake(key))
  const queryString = convertedQueryKeys.join(', ')
  const queryValuesString = queryKeys.map(
    (key, index) => `$${index + 1}`
  ).join(', ')


  if(returnValues) {
    return {
      text: `INSERT INTO ${table} (${queryString}) VALUES (${queryValuesString}) RETURNING *`,
      values: queryValues
    }
  } else {
    return {
      text: `INSERT INTO ${table} (${queryString}) VALUES (${queryValuesString})`,
      values: queryValues
    }
  }
}

module.exports.createUpdateQuery = (inputObject, table, selector, optSelectorValue) => {  
  const queryKeys = Object.keys(inputObject).filter(
    key => inputObject[key] !== null && key !== selector
  )
  const queryValues = queryKeys.map(key => inputObject[key])
  const queryString = queryKeys.map((key, index) => {
    return `${key} = $${index + 1}`
  }).join(', ')

  if (optSelectorValue) {
    return {
      text: `UPDATE ${table} SET ${queryString} WHERE ${selector} = '${optSelectorValue}' RETURNING id`,
      values: queryValues
    }
  } else {
    return {
      text: `UPDATE ${table} SET ${queryString} WHERE ${selector} = '${inputObject[selector]}' RETURNING id`,
      values: queryValues
    }
  }
}

