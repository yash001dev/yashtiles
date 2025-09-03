# Single Command Docker Build for YashTiles

## For Linux/Mac (Bash):
```bash
docker build -t yashtiles:latest --build-arg NODE_ENV=production --build-arg NEXT_PUBLIC_BASE_URL=https://stage.photoframix.com --build-arg NEXT_PUBLIC_APP_NAME=YashTiles --build-arg NEXT_PUBLIC_APP_VERSION=1.0.0 --build-arg NEXT_PUBLIC_API_URL=https://stage.photoframix.com --build-arg NEXT_PUBLIC_ENVIRONMENT=production --build-arg NEXT_PUBLIC_ENABLE_DEBUG=false --build-arg NEXT_PUBLIC_ENABLE_ANALYTICS=true --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=829564712055-nv247pdurodv3atd4jv24rsaom8qsscm.apps.googleusercontent.com --build-arg NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/hw5gjfx78 --build-arg NEXT_PUBLIC_PAYU_KEY=rGRiaJ --build-arg NEXT_PUBLIC_PAYU_SALT=BEoQBAySdr3GiB413ZIp0ydW3UHeap8f .
```

## For Windows (PowerShell):
```powershell
docker build -t yashtiles:latest `
  --build-arg NODE_ENV=production `
  --build-arg NEXT_PUBLIC_BASE_URL=https://stage.photoframix.com `
  --build-arg NEXT_PUBLIC_APP_NAME=YashTiles `
  --build-arg NEXT_PUBLIC_APP_VERSION=1.0.0 `
  --build-arg NEXT_PUBLIC_API_URL=https://stage.photoframix.com `
  --build-arg NEXT_PUBLIC_ENVIRONMENT=production `
  --build-arg NEXT_PUBLIC_ENABLE_DEBUG=false `
  --build-arg NEXT_PUBLIC_ENABLE_ANALYTICS=true `
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=829564712055-nv247pdurodv3atd4jv24rsaom8qsscm.apps.googleusercontent.com `
  --build-arg NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/hw5gjfx78 `
  --build-arg NEXT_PUBLIC_PAYU_KEY=rGRiaJ `
  --build-arg NEXT_PUBLIC_PAYU_SALT=BEoQBAySdr3GiB413ZIp0ydW3UHeap8f `
  .
```

## For Windows (CMD):
```cmd
docker build -t yashtiles:latest ^
  --build-arg NODE_ENV=production ^
  --build-arg NEXT_PUBLIC_BASE_URL=https://stage.photoframix.com ^
  --build-arg NEXT_PUBLIC_APP_NAME=YashTiles ^
  --build-arg NEXT_PUBLIC_APP_VERSION=1.0.0 ^
  --build-arg NEXT_PUBLIC_API_URL=https://stage.photoframix.com ^
  --build-arg NEXT_PUBLIC_ENVIRONMENT=production ^
  --build-arg NEXT_PUBLIC_ENABLE_DEBUG=false ^
  --build-arg NEXT_PUBLIC_ENABLE_ANALYTICS=true ^
  --build-arg NEXT_PUBLIC_GOOGLE_CLIENT_ID=829564712055-nv247pdurodv3atd4jv24rsaom8qsscm.apps.googleusercontent.com ^
  --build-arg NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/hw5gjfx78 ^
  --build-arg NEXT_PUBLIC_PAYU_KEY=rGRiaJ ^
  --build-arg NEXT_PUBLIC_PAYU_SALT=BEoQBAySdr3GiB413ZIp0ydW3UHeap8f ^
  .
```

## Quick Test Commands:

### Test locally:
```bash
docker run -p 3000:3000 yashtiles:latest
```

### Test with environment override:
```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_BASE_URL=http://localhost:3000 yashtiles:latest
```

### Check image size:
```bash
docker images yashtiles:latest
```

### Tag for ECR:
```bash
docker tag yashtiles:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/yashtiles:latest
```
