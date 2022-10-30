<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Stripe\StripeClient;

final class PaymentController extends AbstractController {

    #[Route(
        path: '/payment',
        name: 'payment',
        methods: ['POST']
    )]
    public function __invoke(Request $request){

        $content = $request->getContent();

        if (json_decode($content, true) === null){
            return new JsonResponse(["message" => "No request body"], Response::HTTP_BAD_REQUEST);
        }

        if(!array_key_exists("amount", json_decode($content, true))
        || !array_key_exists("card", json_decode($content, true))
        || !array_key_exists("crypto", json_decode($content, true))
        || !array_key_exists("firstName", json_decode($content, true))
        || !array_key_exists("expiredDAte", json_decode($content, true))
        || !array_key_exists("lastName", json_decode($content, true))){
            return new JsonResponse(["message" => "Bad Request"], Response::HTTP_BAD_REQUEST);
        }

        $stripe = new StripeClient(
            'sk_test_51J2zN1BheQMru7Cfjnm6UszqJ5cCzyjK0YmkU3OB3ylS1WgDGPNUQOr79Bk3IZ1lDO8DG29ziSawVuryIiZlzwPJ00EzxM1zip'
        );

        $stripe->paymentIntents->create([
            'amount' => json_decode($content, true)['amount'],
            'currency' => 'eur',
            'payment_method_types' => ['card'],
        ]);

        return new JsonResponse(["message" => "Payment accepted"], Response::HTTP_OK);
    }
}
