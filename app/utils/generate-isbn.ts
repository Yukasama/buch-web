function generateChecksum10(isbn: string) {
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(isbn.charAt(i), 10)
  }
  const checksum = 11 - (sum % 11)
  return checksum === 10 ? 'X' : checksum.toString()
}

function generateChecksum13(isbn: string) {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn.charAt(i), 10)
  }
  const checksum = 10 - (sum % 10)
  return checksum === 10 ? '0' : checksum.toString()
}

export function generateISBN(type: string) {
  let isbn = ''
  if (type === 'ISBN-10') {
    for (let i = 0; i < 9; i++) {
      isbn += Math.floor(Math.random() * 10)
    }
    isbn += generateChecksum10(isbn)
  } else if (type === 'ISBN-13') {
    isbn = '978' // Most ISBN-13 codes start with 978
    for (let i = 3; i < 12; i++) {
      isbn += Math.floor(Math.random() * 10)
    }
    isbn += generateChecksum13(isbn)
  }
  return isbn
}
