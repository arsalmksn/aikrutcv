<?php

namespace App\Http\Requests;

use App\Models\Cv;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCvFinalizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Cv|null $cv */
        $cv = $this->route('cv');

        return $cv !== null && $this->user() !== null && $cv->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'template_id' => ['required', 'integer', 'exists:templates,id'],
            'is_published' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul CV wajib diisi.',
            'title.string' => 'Judul CV harus berupa teks.',
            'title.max' => 'Judul CV maksimal 255 karakter.',
            'template_id.required' => 'Template wajib dipilih.',
            'template_id.integer' => 'ID template tidak valid.',
            'template_id.exists' => 'Template yang dipilih tidak ditemukan.',
            'is_published.required' => 'Status publikasi wajib ditentukan.',
            'is_published.boolean' => 'Status publikasi harus bernilai boolean.',
        ];
    }
}
