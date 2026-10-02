<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCvFinalizationRequest;
use App\Models\Cv;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class CvFinalizationController extends Controller
{
    /**
     * Finalize the CV details including title, template, and publication status.
     */
    public function finalize(UpdateCvFinalizationRequest $request, Cv $cv): JsonResponse|RedirectResponse
    {
        $cv->update([
            'title' => $request->validated('title'),
            'template_id' => $request->validated('template_id'),
            'is_published' => $request->boolean('is_published'),
        ]);

        $cv->load(['contact', 'template', 'experiences', 'educations', 'skills', 'summary', 'organizations', 'certifications', 'awards']);

        if ($request->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => 'CV berhasil difinalisasi.',
                'cv' => $cv,
                'is_complete' => $cv->isComplete(),
                'checklist' => $cv->completenessChecklist(),
            ]);
        }

        return back()->with('success', 'CV berhasil difinalisasi.');
    }

    /**
     * Export and download the CV as a rendered PDF document.
     */
    public function downloadPdf(Request $request, Cv $cv): Response
    {
        abort_if($cv->user_id !== $request->user()?->id, 403);

        $cv->load(['contact', 'template', 'experiences', 'educations', 'skills', 'summary', 'organizations', 'certifications', 'awards']);

        $viewName = 'cv.pdf';
        if ($cv->template !== null) {
            $templateSlug = Str::slug($cv->template->name);
            if (view()->exists("cv.templates.{$templateSlug}")) {
                $viewName = "cv.templates.{$templateSlug}";
            }
        }

        $pdf = Pdf::loadView($viewName, [
            'cv' => $cv,
        ]);

        $pdf->setPaper('a4', 'portrait');

        $safeTitle = Str::slug($cv->title ?: 'curriculum-vitae');
        $filename = "{$safeTitle}.pdf";

        if ($request->boolean('stream')) {
            return $pdf->stream($filename);
        }

        return $pdf->download($filename);
    }
}
