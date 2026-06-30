/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '1aj7s3z9cq1cpstd.public.blob.vercel-storage.com',
            },
            {
                protocol: 'https',
                hostname: '**.blob.vercel-storage.com',
            },
            {
                protocol: 'https',
                hostname: '**.vercel.app',
            },
        ],
    },
};

export default nextConfig;
