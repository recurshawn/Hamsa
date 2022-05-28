import { useRouter } from 'next/router'

export default function PublicPage() {
    const router = useRouter()
  const { walletAddress } = router.query
    return (
        <div>
            <h1>{walletAddress}'s</h1>
        </div>
    );
}