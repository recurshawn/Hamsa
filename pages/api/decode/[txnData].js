
export default function handler(req, res) {
    const { txnData } = req.query
    res.status(200).json({ txn: txnData })
  }