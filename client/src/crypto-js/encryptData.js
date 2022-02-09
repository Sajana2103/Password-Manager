import CryptoJS from 'crypto-js'

export const encryption = (data,privateKey) =>{
  const enc = CryptoJS.AES.encrypt(data,privateKey)
  return enc
}
export const decryption = (encrypted,privateKey) => {
  const dec = CryptoJS.AES.decrypt(encrypted,privateKey)
  return dec
}

export default CryptoJS