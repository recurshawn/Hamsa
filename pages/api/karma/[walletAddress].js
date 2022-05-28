
export default function handler(req, res) {
    const { walletAddress } = req.query
    res.status(200).json({ 'wallet-address' : walletAddress })
  }