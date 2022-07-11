import { fixedDigits } from 'const';
import { BigNumberish, ethers } from 'ethers';

export const shortenWalletAddress = (address: string) => {
  if (!address) return ''

  if (address.length < 12) {
    return address
  }

  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export const formatNumber = (number: number) => {
  return number.toFixed(fixedDigits)
}

export const wei2Number = (wei: BigNumberish): number => {
  return Number(ethers.utils.formatEther(wei))
}
