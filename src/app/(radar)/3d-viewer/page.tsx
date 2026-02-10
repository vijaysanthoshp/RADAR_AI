import { ModelViewer } from '@/components/3d/ModelViewer'

export default function ThreeDViewerPage() {
  return (
    <div className="h-full w-full p-6">
      <ModelViewer
        modelPath="/model.glb"
        title="3D Medical Model Viewer"
        description="Interact with the 3D model using your mouse - rotate, zoom, and pan to explore from all angles."
      />
    </div>
  )
}
