function getRandomIntInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateRandomNumber(length: number) {
  let num = ""
  for (let i = 0; i < length; i++) {
    num += getRandomIntInRange(0, 9)
  }
  return num
}
